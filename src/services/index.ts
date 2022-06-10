import { ItemsService } from "directus"
import type { Request } from "express"
import type { Accountability } from "@directus/shared/dist/esm/types"

import type ExtensionContext from "../types/ExtensionContext"
import type { FilterHookContext } from "../types/RegisterHook/FilterHookHandler"
import type { ActionHookContext } from "../types/RegisterHook/ActionHookHandler"
import type Models from "../models"

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  context: FilterHookContext,
  accountability?: Partial<Accountability>,
): ItemsService<TItem>

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  context: ActionHookContext,
  accountability?: Partial<Accountability>,
): ItemsService<TItem>

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  req: Request,
  context: ExtensionContext,
  accountability?: Partial<Accountability>,
): ItemsService<TItem>

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  reqOrFilterCtxOrActionCtx: Request | FilterHookContext | ActionHookContext,
  contextOrAccountability?: ExtensionContext | Partial<Accountability>,
  accountability?: Partial<Accountability>,
): ItemsService<TItem> {
  let itemsService: ItemsService<TItem>
  if (
    "database" in reqOrFilterCtxOrActionCtx &&
    (contextOrAccountability === undefined ||
      !("database" in contextOrAccountability))
  ) {
    // 2nd param is FilterHookContext | ActionHookContext
    // 3rd param is Accountability?
    const filterCtxOrActionCtx = reqOrFilterCtxOrActionCtx
    const accountability = contextOrAccountability
    itemsService = new ItemsService<TItem>(collectionName, {
      schema: filterCtxOrActionCtx.schema,
      knex: filterCtxOrActionCtx.database,
      accountability: {
        ...filterCtxOrActionCtx.accountability,
        ...accountability,
      },
    })
  } else if (
    "url" in reqOrFilterCtxOrActionCtx &&
    contextOrAccountability &&
    "database" in contextOrAccountability
  ) {
    // 2nd param is express Request
    // 3rd param is ExtensionContext
    // 4rd param is Accountability?
    const req = reqOrFilterCtxOrActionCtx
    const context = contextOrAccountability
    itemsService = new ItemsService<TItem>(collectionName, {
      schema: req.schema,
      knex: context.database,
      accountability: req.accountability
        ? { ...req.accountability, ...accountability }
        : req.accountability,
    })
  } else {
    throw new Error(`Invalid parameters type passed to ${getItemsService.name}`)
  }
  return itemsService
}
