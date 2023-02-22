import type { ErrorRequestHandler, RequestHandler } from "express"
// eslint-disable-next-line n/no-missing-import -- The @types/* exist, type only package without js
import type { RouteParameters } from "express-serve-static-core"
// eslint-disable-next-line n/no-extraneous-import -- The @types/* exist, type only package without js
import type { ParsedQs } from "qs"

// Standard RequestHandler
type VoidReqHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> = RequestHandler<RouteParameters<Route>, ResBody, ReqBody, ParsedQs, Locals>

// RequestHandler that return Promise<void> instead of void
export type AsyncReqHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> = (
  ...args: Parameters<
    RequestHandler<RouteParameters<Route>, ResBody, ReqBody, ParsedQs, Locals>
  >
) => Promise<
  ReturnType<
    RequestHandler<RouteParameters<Route>, ResBody, ReqBody, ParsedQs, Locals>
  >
>

type ReqHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> =
  | VoidReqHandler<Route, ReqBody, ResBody, Locals>
  | AsyncReqHandler<Route, ReqBody, ResBody, Locals>

// Standard ErrorRequestHandler
type VoidErrHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> = ErrorRequestHandler<
  RouteParameters<Route>,
  ResBody,
  ReqBody,
  ParsedQs,
  Locals
>

// ErrorRequestHandler that return Promise<void> instead of void
type AsyncErrHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> = (
  ...args: Parameters<
    ErrorRequestHandler<
      RouteParameters<Route>,
      ResBody,
      ReqBody,
      ParsedQs,
      Locals
    >
  >
) => Promise<
  ReturnType<
    ErrorRequestHandler<
      RouteParameters<Route>,
      ResBody,
      ReqBody,
      ParsedQs,
      Locals
    >
  >
>

type ErrHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> =
  | VoidErrHandler<Route, ReqBody, ResBody, Locals>
  | AsyncErrHandler<Route, ReqBody, ResBody, Locals>

/**
 * Handles promises in express app or router middleware.
 *
 * ### Usage:
 *
 * ```js
 * router.get(
 *   "/:provider/:override?",
 *   // eslint-disable-next-line @typescript-eslint/no-misused-promises
 *   asyncHandler<"/:provider/:override?">(async (req, res, next) => {
 *     // req.params.provider and req.params.override will be typed here
 *   }),
 * )
 * ```
 * @param handler express middleware in async/await
 * @returns Wrapped express middleware to be added into express app/router
 */
function asyncHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: ReqHandler<Route, ReqBody, ResBody, Locals>,
): VoidReqHandler<Route, ReqBody, ResBody, Locals>

function asyncHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: ErrHandler<Route, ReqBody, ResBody, Locals>,
): VoidErrHandler<Route, ReqBody, ResBody, Locals>

function asyncHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler:
    | ReqHandler<Route, ReqBody, ResBody, Locals>
    | ErrHandler<Route, ReqBody, ResBody, Locals>,
):
  | VoidReqHandler<Route, ReqBody, ResBody, Locals>
  | VoidErrHandler<Route, ReqBody, ResBody, Locals> {
  if (handler.length === 2 || handler.length === 3) {
    const scoped: VoidReqHandler<Route, ReqBody, ResBody, Locals> = (
      req,
      res,
      next,
    ) => {
      Promise.resolve(
        (handler as ReqHandler<Route, ReqBody, ResBody, Locals>)(
          req,
          res,
          next,
        ),
      ).catch(next)
    }
    return scoped
  } else if (handler.length === 4) {
    const scoped: VoidErrHandler<Route, ReqBody, ResBody, Locals> = (
      err,
      req,
      res,
      next,
    ) => {
      Promise.resolve(
        (handler as ErrHandler<Route, ReqBody, ResBody, Locals>)(
          err,
          req,
          res,
          next,
        ),
      ).catch(next)
    }
    return scoped
  } else {
    throw new Error(`Failed to asyncHandle() function "${handler.name}"`)
  }
}

export default asyncHandler
