import type FilterHookHandler from "./FilterHookHandler"
import type ActionHookHandler from "./ActionHookHandler"
import type InitHookHandler from "./InitHookHandler"
import type ScheduleHookHandler from "./ScheduleHookHandler"
import type ExtensionContext from "../ExtensionContext"

import Models from "../../models"

export type { default as FilterHookHandler } from "./FilterHookHandler"
export type { default as ActionHookHandler } from "./ActionHookHandler"
export type { default as InitHookHandler } from "./InitHookHandler"
export type { default as ScheduleHookHandler } from "./ScheduleHookHandler"

export interface HookHandlers<TModels> {
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
