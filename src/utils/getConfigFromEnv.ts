import camelcase from "camelcase"
import { set } from "lodash"

import type { Env } from "../types/ExtensionContext"

export default function getConfigFromEnv(
  env: Env,
  prefix: string,
  omitPrefix?: string | string[],
  type: "camelcase" | "underscore" = "camelcase",
): Env {
  const config: Env = {}

  for (const [key, value] of Object.entries(env)) {
    if (key.toLowerCase().startsWith(prefix.toLowerCase()) === false) continue

    if (omitPrefix) {
      let matches = false

      if (Array.isArray(omitPrefix)) {
        matches = omitPrefix.some((prefix) =>
          key.toLowerCase().startsWith(prefix.toLowerCase()),
        )
      } else {
        matches = key.toLowerCase().startsWith(omitPrefix.toLowerCase())
      }

      if (matches) continue
    }

    if (key.includes("__")) {
      const path = key
        .split("__")
        .map((key, index) =>
          index === 0
            ? transform(transform(key.slice(prefix.length)))
            : transform(key),
        )
      set(config, path.join("."), value)
    } else {
      config[transform(key.slice(prefix.length))] = value
    }
  }

  return config

  function transform(key: string): string {
    if (type === "camelcase") {
      return camelcase(key)
    } else if (type === "underscore") {
      return key.toLowerCase()
    }

    return key
  }
}
