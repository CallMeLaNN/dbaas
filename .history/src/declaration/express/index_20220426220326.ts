/**
 * Custom properties on the req object in express
 */
import {
  Accountability,
  SchemaOverview,
  Query,
} from "@directus/shared/dist/esm/types"

declare global {
  namespace Express {
    interface Request {
      token: string | null
      collection: string
      sanitizedQuery: Query
      schema: SchemaOverview

      accountability?: Accountability
      singleton?: boolean
    }
  }
}
