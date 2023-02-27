import type { ItemsService } from "directus"
import type { Request } from "express"

import type Models from "../models/index.js"
import ExtensionContext from "../types/ExtensionContext.js"
import type { ActionHookContext } from "../types/RegisterHook/ActionHookHandler.js"
import type { FilterHookContext } from "../types/RegisterHook/FilterHookHandler.js"
import createItemsService from "./createItemsService.js"

/** Services instance created per request or filter/action context */
abstract class ServicesBase {
  /** Global extension context */
  #extensionContext: ExtensionContext
  /** The the context or request this services instance made for */
  #requestOrHookContext: Request | (FilterHookContext | ActionHookContext)
  /** The cached directus ItemsService for this.getItemsService() */
  #itemsServices: Partial<{
    [TCollection in keyof Models]: ItemsService<Models[TCollection]>
  }> = {}

  constructor(
    extensionContext: ExtensionContext,
    requestOrHookContext: Request | (FilterHookContext | ActionHookContext),
  ) {
    this.#extensionContext = extensionContext
    this.#requestOrHookContext = requestOrHookContext
  }

  get extensionContext(): ExtensionContext {
    return this.#extensionContext
  }

  get requestOrHookContext():
    | Request
    | (FilterHookContext | ActionHookContext) {
    return this.#requestOrHookContext
  }

  /** Get and cache the directus ItemsService */
  getItemsService<TCollection extends keyof Models>(
    collection: TCollection,
  ): ItemsService<Models[TCollection]> {
    let itemsService: ItemsService<Models[TCollection]> | undefined =
      this.#itemsServices[collection]
    if (!itemsService) {
      const reqOrHookCtx = this.requestOrHookContext
      // This check is unnecessary in JS but just to satisfy TS
      // against choosing the createItemsService overloads
      if ("url" in reqOrHookCtx) {
        itemsService = createItemsService(collection, reqOrHookCtx)
      } else {
        itemsService = createItemsService(collection, reqOrHookCtx)
      }
      this.#itemsServices[collection] = itemsService as Partial<{
        [TCollection in keyof Models]: ItemsService<Models[TCollection]>
      }>[TCollection]
    }
    return itemsService
  }
}

export default ServicesBase
