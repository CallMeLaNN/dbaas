import type FilterHookHandler from "./FilterHookHandler.js"
import type ActionHookHandler from "./ActionHookHandler.js"
import type InitHookHandler from "./InitHookHandler.js"
import type ScheduleHookHandler from "./ScheduleHookHandler.js"
import type ExtensionContext from "../ExtensionContext.js"

import Models from "../../models/index.js"

export type {
  default as FilterHookHandler,
  FilterHookContext,
} from "./FilterHookHandler.js"
export type {
  default as ActionHookHandler,
  ActionHookContext,
} from "./ActionHookHandler.js"
export type { default as InitHookHandler } from "./InitHookHandler.js"
export type { default as ScheduleHookHandler } from "./ScheduleHookHandler.js"

export interface HookHandlers<TModels extends Models = Models> {
  filter: FilterHookHandler<TModels>
  action: ActionHookHandler<TModels>
  init: InitHookHandler
  schedule: ScheduleHookHandler
}

export type RegisterHook<TModels extends Models = Models> = (
  hookHandlers: HookHandlers<TModels>,
  ctx: ExtensionContext,
) => void

export default RegisterHook
