import type {
  Accountability,
  SchemaOverview,
  Query,
} from "@directus/shared/dist/esm/types"
import type { Knex } from "knex"

import type { UnionToIntersection } from "../../utils/types"
import type SystemModels from "../../models/SystemModels"

/**
 * Filter Hook callback context
 */

export interface FilterHookContext {
  /** Current database transaction */
  database: Knex
  /** The current API schema in use */
  schema: SchemaOverview
  /** Information about the current user */
  accountability: Accountability
}

export type FilterHookHandlerBase<
  TName extends string = string,
  TPayload = unknown,
  TMeta = unknown,
  TReturn = unknown,
> = (
  name: TName,
  callback: (
    payload: TPayload,
    meta: TMeta,
    ctx: FilterHookContext,
  ) => Promise<TReturn>,
) => void

export type RequestNotFoundFilterHookHandler = FilterHookHandlerBase<
  "request.not_found",
  false,
  { request: unknown; response: unknown }
>
export type RequestErrorFilterHookHandler = FilterHookHandlerBase<
  "request.error",
  unknown,
  undefined
>
export type DatabaseErrorFilterHookHandler = FilterHookHandlerBase<
  "database.error",
  unknown,
  { client: undefined }
>
export type AuthLoginFilterHookHandler = FilterHookHandlerBase<
  "auth.login",
  unknown,
  { status: undefined; user: undefined; provider: undefined }
>
export type AuthJwtFilterHookHandler = FilterHookHandlerBase<
  "auth.jwt",
  string,
  { status: undefined; user: undefined; provider: undefined; type: undefined }
>

export type AllItemCollectionCrudFilterHookHandlers = FilterHookHandlerBase<
  `items.read`,
  unknown[],
  { query: Query; collection: string }
> &
  FilterHookHandlerBase<
    `items.create`,
    unknown,
    { collection: string },
    unknown
  > &
  FilterHookHandlerBase<
    `items.update`,
    unknown,
    { collection: string; keys: (string | number)[] },
    unknown
  > &
  FilterHookHandlerBase<
    `items.delete`,
    (string | number)[],
    { collection: string }
  >

export type ItemCollectionCrudFilterHookHandler<
  TName extends string,
  TPayload,
> = FilterHookHandlerBase<
  `${TName}.items.read`,
  TPayload[],
  { query: Query; collection: string }
> &
  FilterHookHandlerBase<
    `${TName}.items.create`,
    TPayload,
    { collection: string },
    TPayload
  > &
  FilterHookHandlerBase<
    `${TName}.items.update`,
    TPayload,
    { collection: string; keys: (string | number)[] },
    TPayload
  > &
  FilterHookHandlerBase<
    `${TName}.items.delete`,
    (string | number)[],
    { collection: string }
  >

export type SystemCollectionCrudFilterHookHandler<
  TName extends string,
  TPayload,
> = FilterHookHandlerBase<
  `${TName}.create`,
  TPayload,
  { collection: string },
  TPayload
> &
  FilterHookHandlerBase<
    `${TName}.update`,
    TPayload,
    { collection: string; keys: (string | number)[] },
    TPayload
  > &
  FilterHookHandlerBase<
    `${TName}.delete`,
    (string | number)[],
    { collection: string }
  >

// We can't simply make like this:
// type ItemCollectionFilterHookHandlers<TModels> = ItemCollectionCrudFilterHookHandler<Extract< keyof TModels, string>, TModels[keyof TModels]>
// because it will create like this:
// (name: "orders.items.read" | "invoices.items.read", callback: (payload: Order | Invoice, ...) => Promise<TReturn>) => void
// The `name` and `payload` is detached and TypeScript can't infer payload type based on name.
// It should be overloads based function in order for TypeScript to detect as one function with different parameter types:
// (name: "orders.items.read", callback: (payload: Order, ...) => Promise<void>) => void &
// (name: "invoices.items.read", callback: (payload: Invoice, ...) => Promise<void>) => void

// To do that we create:
// 1. TypeScript Mapped type to generate individual overload functions
//    `{ a: A, b: B }` become `{ a: ("a", (a: A) => void) => void,  b: ("b", (b: A) => void) => void}`
// 2. Create union from the mapped types because that is what `AType[keyof AType]` do, "all types" from a type properties.
//    `(a: A) => void) => void | (b: B) => void) => void`
// 3. Convert union to intersection to turn "all types" into function with overloads.
//    `(a: A) => void) => void & (b: B) => void) => void`
type ItemCollectionFilterHookHandlerModels<TModels> = {
  [key in Extract<keyof TModels, string>]: ItemCollectionCrudFilterHookHandler<
    key,
    TModels[key]
  >
}
type AllItemCollectionFilterHookHandlerModels<TModels> =
  ItemCollectionFilterHookHandlerModels<TModels>[keyof ItemCollectionFilterHookHandlerModels<TModels>]
export type ItemCollectionCrudFilterHookHandlers<TModels> = UnionToIntersection<
  AllItemCollectionFilterHookHandlerModels<TModels>
>
export type ItemCollectionFilterHookHandlers<TModels> =
  AllItemCollectionCrudFilterHookHandlers &
    ItemCollectionCrudFilterHookHandlers<TModels>

type SystemCollectionFilterHookHandlerModels<TModels> = {
  [key in Extract<
    keyof TModels,
    string
  >]: SystemCollectionCrudFilterHookHandler<key, TModels[key]>
}
type AllSystemCollectionFilterHookHandler<TModels> =
  SystemCollectionFilterHookHandlerModels<TModels>[keyof SystemCollectionFilterHookHandlerModels<TModels>]
export type SystemCollectionFilterHookHandlers<TModels> = UnionToIntersection<
  AllSystemCollectionFilterHookHandler<TModels>
>

type FilterHookHandler<TModels> = RequestNotFoundFilterHookHandler &
  RequestErrorFilterHookHandler &
  DatabaseErrorFilterHookHandler &
  AuthLoginFilterHookHandler &
  AuthJwtFilterHookHandler &
  ItemCollectionFilterHookHandlers<TModels> &
  SystemCollectionFilterHookHandlers<SystemModels> &
  FilterHookHandlerBase

export default FilterHookHandler
