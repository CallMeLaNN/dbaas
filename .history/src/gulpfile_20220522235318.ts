import { ChildProcess, spawn } from "child_process"
import log from "fancy-log"
import Graceful from "node-graceful"

Graceful.captureExceptions = true
Graceful.captureRejections = true

const childProcessesToKill: ChildProcess[] = []
const cleanupsOnExit: PromiseLike<void>[] = []

const createDelay = (timeout: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

Graceful.on("exit", async (_signal, details) => {
  if (details) {
    log.error("Unhandled exception or rejection")
    log.error(details)
  }
  log.info("Graceful exit started")

  setTimeout(() => {
    log.error("Graceful exit timeout. Terminating immediately...")
    // Ensure logged before process terminated.
  }, Graceful.timeout - 100)

  childProcessesToKill.forEach((cp) => cp.kill("SIGINT"))

  await Promise.all(cleanupsOnExit).catch((err) => {
    log.error("Unhandled exception during graceful cleanup")
    log.error(err)
  })

  // Give chance for Gulp task to return from the last callback
  // So it doesn't have to report "tasks did not complete" accidentally
  await createDelay(50)

  log.info("Graceful exit done")
})

const createSpawn = async (command: string, args: string[]) => {
  const childProcess = spawn(command, args, {
    shell: true,
    stdio: "inherit",
  })
  const waitForExitPromise = new Promise<void>((resolve, reject) => {
    childProcess.on("exit", (code) => {
      // cleanup
      let index = childProcessesToKill.indexOf(childProcess)
      if (index >= 0) childProcessesToKill.splice(index, 1)
      index = cleanupsOnExit.indexOf(waitForExitPromise)
      if (index >= 0) cleanupsOnExit.splice(index, 1)

      // nodemon hard coded exit code: SIGINT=130, SIGTERM=143
      if (!code || (command === "nodemon" && (code === 130 || code === 143))) {
        resolve()
      } else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed with exit code ${code}`,
          ),
        )
      }
    })
  })

  childProcessesToKill.push(childProcess)
  cleanupsOnExit.push(waitForExitPromise)

  return waitForExitPromise
}

const spawnDBaaS = async () => {
  const command = "nodemon"
  const args = ["--config", "nodemon.dbaas.json"]
  return createSpawn(command, args)
}

const spawnTsc = async (watch: boolean) => {
  const command = "tsc"
  let args = ["-p", "src/extensions/tsconfig.json", "--pretty"]
  if (watch) args = [...args, "--watch", "--preserveWatchOutput"]
  return createSpawn(command, args)
}

/**
 * Start
 * 1. tsc compile the code in case first time js file doesn't exist
 * 2. start with watch - auto restart on .js file change
 * 3. tsc recompile on .ts file change
 */
export const start = async (): Promise<void> => {
  // First time compilation to ensure the output is exists before start any watch.
  const runTscPromise = spawnTsc(false)
  log.info("Starting TypeScript compilation")
  // It will throw and exit if the compilation fails.
  await runTscPromise
  log.info("Compilation done")

  const startTscPromise = spawnTsc(true)
  const startDBaaSPromise = spawnDBaaS()

  const startPromise = Promise.all([startDBaaSPromise, startTscPromise])
  await startPromise.catch((err) => {
    // If one process failed, kill the rest of the other processes also.
    childProcessesToKill.forEach((cp) => cp.kill("SIGINT"))
    return Promise.reject(err)
  })
}

/**
 * Serve with watch - auto restart on file change
 */
export const serve = async (): Promise<void> => {
  const startDBaaSPromise = spawnDBaaS()
  await startDBaaSPromise.catch((err) => {
    // If one process failed, kill the rest of the other processes also.
    childProcessesToKill.forEach((cp) => cp.kill("SIGINT"))
    return Promise.reject(err)
  })
}
