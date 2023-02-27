import { ItemsService } from "directus"
import { AbstractServiceOptions } from "directus/types/services"
import type { Request } from "express"

import type Models from "../models/index.js"
import type { ActionHookContext } from "../types/RegisterHook/ActionHookHandler.js"
import type { FilterHookContext } from "../types/RegisterHook/FilterHookHandler.js"

function createItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  context: FilterHookContext,
  options?: Partial<AbstractServiceOptions>,
): ItemsService<TItem>

function createItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  context: ActionHookContext,
  options?: Partial<AbstractServiceOptions>,
): ItemsService<TItem>

function createItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  req: Request,
  options?: Partial<AbstractServiceOptions>,
): ItemsService<TItem>

function createItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  reqOrFilterCtxOrActionCtx: Request | FilterHookContext | ActionHookContext,
  options?: Partial<AbstractServiceOptions>,
): ItemsService<TItem> {
  let itemsService: ItemsService<TItem>
  if ("database" in reqOrFilterCtxOrActionCtx) {
    // 2nd param is FilterHookContext | ActionHookContext
    const filterCtxOrActionCtx = reqOrFilterCtxOrActionCtx
    itemsService = new ItemsService<TItem>(collectionName, {
      schema: filterCtxOrActionCtx.schema,
      knex: filterCtxOrActionCtx.database,
      ...options,
      accountability: {
        ...filterCtxOrActionCtx.accountability,
        ...options?.accountability,
      },
    })
  } else if ("url" in reqOrFilterCtxOrActionCtx) {
    // 2nd param is express Request
    const req = reqOrFilterCtxOrActionCtx
    itemsService = new ItemsService<TItem>(collectionName, {
      schema: req.schema,
      ...options,
      accountability: {
        // Satisfy required type
        ...{ role: null },
        ...req.accountability,
        ...options?.accountability,
      },
    })
  } else {
    throw new Error(
      `Invalid parameters type passed to ${createItemsService.name}`,
    )
  }
  return itemsService
}

export default createItemsService
