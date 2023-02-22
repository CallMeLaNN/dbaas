import type { Application } from "express"

export type InitHookHandlerBase<
  TName extends string = string,
  TMeta = unknown,
> = (name: TName, callback: (meta: TMeta) => Promise<void>) => void

type InitHookHandler = InitHookHandlerBase<"cli.before", { program: unknown }> &
  InitHookHandlerBase<"cli.after", { program: unknown }> &
  InitHookHandlerBase<"app.before", { app: Application }> &
  InitHookHandlerBase<"app.after", { app: Application }> &
  InitHookHandlerBase<"routes.before", { app: Application }> &
  InitHookHandlerBase<"routes.after", { app: Application }> &
  InitHookHandlerBase<"routes.custom.before", { app: Application }> &
  InitHookHandlerBase<"routes.custom.after", { app: Application }> &
  InitHookHandlerBase<"middlewares.before", { app: Application }> &
  InitHookHandlerBase<"middlewares.after", { app: Application }>

export default InitHookHandler
