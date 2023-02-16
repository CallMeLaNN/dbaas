import type services from "directus/services/index"
import type exceptions from "directus/exceptions/index"
import type { getSchema } from "directus/utils/get-schema"
import type { Emitter } from "directus/emitter"
import type { Logger } from "pino"
import type { Knex } from "knex"

export type Env = Record<string, string | number | boolean>

type ExtensionContext = {
  services: typeof services
  exceptions: typeof exceptions
  database: Knex
  env: Env
  emitter: Emitter
  logger: Logger
  getSchema: typeof getSchema
}

export default ExtensionContext
