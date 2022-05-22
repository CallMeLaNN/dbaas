import { ItemsService } from "directus"
import type { Request } from "express"

import type ExtensionContext from "../types/ExtensionContext"
import type Models from "../models"

export function getItemsService<
  TItem extends Models[TCollectionName],
  TCollectionName extends keyof Models,
>(collectionName: TCollectionName, req: Request, context: ExtensionContext) {
  const itemsService = new ItemsService<TItem>(collectionName, {
    schema: req.schema,
    accountability: req.accountability,
    knex: context.database,
  })
  return itemsService
}
