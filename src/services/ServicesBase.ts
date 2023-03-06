import {
  InvalidConfigException,
  InvalidCredentialsException,
  ItemsService,
} from "directus"
import type { AbstractServiceOptions } from "directus/types/services"
import type { Request } from "express"

import type Models from "../models/index.js"
import type ExtensionContext from "../types/ExtensionContext.js"
import type { ActionHookContext } from "../types/RegisterHook/ActionHookHandler.js"
import type { FilterHookContext } from "../types/RegisterHook/FilterHookHandler.js"
import createItemsService from "./createItemsService.js"
import getUserAccountability from "./getUserAccountability.js"

/** Services instance created per request or filter/action context */
abstract class ServicesBase {
  /** Global extension context */
  #extensionContext: ExtensionContext

  /** The the context or request this services instance made for */
  #requestOrHookContext: Request | (FilterHookContext | ActionHookContext)

  /** The ItemsService options */
  #options?: Partial<AbstractServiceOptions>

  /** The cached ItemsService scoped by request or hook context */
  #itemsServices: Partial<{
    [TCollection in keyof Models]: ItemsService<Models[TCollection]>
  }> = {}

  constructor(
    extensionContext: ExtensionContext,
    requestOrHookContext: Request | (FilterHookContext | ActionHookContext),
    options?: Partial<AbstractServiceOptions>,
  ) {
    this.#extensionContext = extensionContext
    this.#requestOrHookContext = requestOrHookContext
    this.#options = options
  }

  get extensionContext(): ExtensionContext {
    return this.#extensionContext
  }

  get requestOrHookContext():
    | Request
    | (FilterHookContext | ActionHookContext) {
    return this.#requestOrHookContext
  }

  get options(): Partial<AbstractServiceOptions> | undefined {
    return this.#options
  }

  async loginAs(userId: string) {
    if (this.#itemsServices) {
      throw new InvalidConfigException(
        "You cannot login after ItemsService has been initialized",
      )
    }
    const accountability = await getUserAccountability(
      this.#requestOrHookContext,
      userId,
    )
    if (!accountability) {
      throw new InvalidCredentialsException("User not found")
    }
    this.#options = {
      ...this.#options,
      accountability: { ...this.#options?.accountability, ...accountability },
    }
  }

  /** Get and cache the ItemsService scoped by request or hook context */
  getItemsService<TCollection extends keyof Models>(
    collection: TCollection,
  ): ItemsService<Models[TCollection]> {
    let itemsService: ItemsService<Models[TCollection]> | undefined =
      this.#itemsServices[collection]
    if (!itemsService) {
      const reqOrHookCtx = this.requestOrHookContext
      const options = this.options

      // This check is unnecessary in JS but just to satisfy TS
      // against choosing the createItemsService overloads
      if ("url" in reqOrHookCtx) {
        itemsService = createItemsService(collection, reqOrHookCtx, options)
      } else {
        itemsService = createItemsService(collection, reqOrHookCtx, options)
      }
      this.#itemsServices[collection] = itemsService as Partial<{
        [TCollection in keyof Models]: ItemsService<Models[TCollection]>
      }>[TCollection]
    }
    return itemsService
  }
}

export default ServicesBase
