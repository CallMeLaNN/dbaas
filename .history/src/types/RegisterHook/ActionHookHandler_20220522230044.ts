import {
  Accountability,
  SchemaOverview,
  Query,
} from "@directus/shared/dist/esm/types"
import { Knex } from "knex"

import { UnionToIntersection } from "../../utils/types"
import SystemModels from "../../models/SystemModels"

/**
 * Action Hook callback context
 */
export interface ActionHookContext {
  /** Current database transaction */
  database: Knex
  /** The current API schema in use */
  schema: SchemaOverview
  /** Information about the current user */
  accountability: Accountability
}

export type ActionHookHandlerBase<
  TName extends string = string,
  TMeta = unknown,
> = (
  name: TName,
  callback: (meta: TMeta, ctx: ActionHookContext) => Promise<void>,
) => void

export type ServerStartActionHookHandler = ActionHookHandlerBase<
  "server.start",
  { server: unknown }
>
export type ServerStopActionHookHandler = ActionHookHandlerBase<
  "server.stop",
  { server: unknown }
>
export type ResponseActionHookHandler = ActionHookHandlerBase<
  "response",
  {
    request: unknown
    response: unknown
    ip: unknown
    duration: unknown
    finished: unknown
  }
>
export type AuthLoginActionHookHandler = ActionHookHandlerBase<
  "auth.login",
  { payload: unknown; status: unknown; user: unknown; provider: unknown }
>
export type FilesUploadActionHookHandler = ActionHookHandlerBase<
  "files.upload",
  { payload: unknown; key: unknown; collection: string }
>

export type AllItemCollectionCrudActionHookHandlers = ActionHookHandlerBase<
  `items.read`,
  { payload: unknown[]; query: Query; collection: string }
> &
  ActionHookHandlerBase<
    `items.create`,
    { payload: unknown; key: string | number; collection: string }
  > &
  ActionHookHandlerBase<
    `items.update`,
    { payload: unknown; keys: (string | number)[]; collection: string }
  > &
  ActionHookHandlerBase<
    `items.delete`,
    { keys: (string | number)[]; collection: string }
  > &
  ActionHookHandlerBase<
    `items.sort`,
    { collection: string; item: unknown; to: unknown }
  >

export type ItemCollectionCrudActionHookHandler<
  TName extends string,
  TPayload,
> = ActionHookHandlerBase<
  `${TName}.items.read`,
  { payload: TPayload[]; query: Query; collection: string }
> &
  ActionHookHandlerBase<
    `${TName}.items.create`,
    { payload: TPayload; key: string | number; collection: string }
  > &
  ActionHookHandlerBase<
    `${TName}.items.update`,
    { payload: TPayload; keys: (string | number)[]; collection: string }
  > &
  ActionHookHandlerBase<
    `${TName}.items.delete`,
    { keys: (string | number)[]; collection: string }
  > &
  ActionHookHandlerBase<
    `${TName}.items.sort`,
    { collection: string; item: unknown; to: unknown }
  >

export type SystemCollectionCrudActionHookHandler<
  TName extends string,
  TPayload,
> = ActionHookHandlerBase<
  `${TName}.create`,
  { payload: TPayload; key: string | number; collection: string }
> &
  ActionHookHandlerBase<
    `${TName}.update`,
    { payload: TPayload; keys: (string | number)[]; collection: string }
  > &
  ActionHookHandlerBase<
    `${TName}.delete`,
    { keys: (string | number)[]; collection: string }
  >

// We can't simply make like this:
// type ItemCollectionActionHookHandlers<TModels> = ItemCollectionCrudActionHookHandler<Extract< keyof TModels, string>, TModels[keyof TModels]>
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
type ItemCollectionActionHookHandlerModels<TModels> = {
  [key in Extract<keyof TModels, string>]: ItemCollectionCrudActionHookHandler<
    key,
    TModels[key]
  >
}
type AllItemCollectionActionHookHandlerModels<TModels> =
  ItemCollectionActionHookHandlerModels<TModels>[keyof ItemCollectionActionHookHandlerModels<TModels>]
export type ItemCollectionCrudActionHookHandlers<TModels> = UnionToIntersection<
  AllItemCollectionActionHookHandlerModels<TModels>
>
export type ItemCollectionActionHookHandlers<TModels> =
  AllItemCollectionCrudActionHookHandlers &
    ItemCollectionCrudActionHookHandlers<TModels>

type SystemCollectionActionHookHandlerModels<TModels> = {
  [key in Extract<
    keyof TModels,
    string
  >]: SystemCollectionCrudActionHookHandler<key, TModels[key]>
}
type AllSystemCollectionActionHookHandlerModels<TModels> =
  SystemCollectionActionHookHandlerModels<TModels>[keyof SystemCollectionActionHookHandlerModels<TModels>]
export type SystemCollectionActionHookHandlers<TModels> = UnionToIntersection<
  AllSystemCollectionActionHookHandlerModels<TModels>
>

type ActionHookHandler<TModels> = ServerStartActionHookHandler &
  ServerStopActionHookHandler &
  ResponseActionHookHandler &
  AuthLoginActionHookHandler &
  FilesUploadActionHookHandler &
  ItemCollectionActionHookHandlers<TModels> &
  SystemCollectionActionHookHandlers<SystemModels> &
  ActionHookHandlerBase

export default ActionHookHandler
