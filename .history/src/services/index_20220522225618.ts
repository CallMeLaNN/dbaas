import { ItemsService } from "directus"
import { Request } from "express"

import ExtensionContext from "../types/ExtensionContext"
import Models from "../models/types"

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
