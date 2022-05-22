export type InitHookHandlerBase<
  TName extends string = string,
  TMeta = unknown,
> = (name: TName, callback: (meta: TMeta) => Promise<void>) => void

type InitHookHandler = InitHookHandlerBase<"cli.before", { program: unknown }> &
  InitHookHandlerBase<"cli.after", { program: unknown }> &
  InitHookHandlerBase<"app.before", { app: unknown }> &
  InitHookHandlerBase<"app.after", { app: unknown }> &
  InitHookHandlerBase<"routes.before", { app: unknown }> &
  InitHookHandlerBase<"routes.after", { app: unknown }> &
  InitHookHandlerBase<"routes.custom.before", { app: unknown }> &
  InitHookHandlerBase<"routes.custom.after", { app: unknown }> &
  InitHookHandlerBase<"middlewares.before", { app: unknown }> &
  InitHookHandlerBase<"middlewares.after", { app: unknown }>

export default InitHookHandler
