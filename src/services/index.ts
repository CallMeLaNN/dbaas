import { ItemsService } from "directus"
import type { Request } from "express"

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
): ItemsService<TItem>

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  context: ActionHookContext,
): ItemsService<TItem>

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  req: Request,
  context: ExtensionContext,
): ItemsService<TItem>

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(
  collectionName: TCollectionName,
  reqOrFilterCtxOrActionCtx: Request | FilterHookContext | ActionHookContext,
  context?: ExtensionContext,
): ItemsService<TItem> {
  const itemsService = new ItemsService<TItem>(collectionName, {
    schema: reqOrFilterCtxOrActionCtx.schema,
    accountability: reqOrFilterCtxOrActionCtx.accountability,
    knex:
      "database" in reqOrFilterCtxOrActionCtx
        ? reqOrFilterCtxOrActionCtx.database
        : context?.database,
  })
  return itemsService
}
