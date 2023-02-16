/**
 * Custom properties on the req object in express
 */
import { Accountability, SchemaOverview, Query } from "@directus/shared/types"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
