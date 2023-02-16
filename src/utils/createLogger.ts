import { pino, Logger, LoggerOptions } from "pino"
// import pinoColada from "pino-colada"

const isPrettyLog = process.env["LOG_STYLE"] === "pretty"
const isTest = process.env["NODE_ENV"] === "test"

export const defaultOptions: LoggerOptions = {
  // turn off during running jest
  enabled: !isTest,
  base: undefined,
  timestamp: isPrettyLog
    ? () => pino.stdTimeFunctions.isoTime().replace("T", " ")
    : true,
  // TODO: What to replace this flag?
  // prettyPrint: isPrettyLog,
  // prettifier: isPrettyLog ? pinoColada : undefined,
}

export default function createLogger(
  name: string,
  opts?: LoggerOptions,
): Logger<LoggerOptions> {
  return pino({ ...defaultOptions, name, ...opts })
}
