import type { ErrorRequestHandler, RequestHandler } from "express"
// eslint-disable-next-line node/no-missing-import
import type { RouteParameters } from "express-serve-static-core"
// eslint-disable-next-line node/no-extraneous-import
import type { ParsedQs } from "qs"

type ReqHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
> = RequestHandler<RouteParameters<Route>, ResBody, ReqBody, ParsedQs, Locals>

type ErrHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
> = ErrorRequestHandler<
  RouteParameters<Route>,
  ResBody,
  ReqBody,
  ParsedQs,
  Locals
>

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
  Locals = Record<string, unknown>,
>(
  handler: ReqHandler<Route, ReqBody, ResBody, Locals>,
): ReqHandler<Route, ReqBody, ResBody, Locals>

function asyncHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
>(
  handler: ErrHandler<Route, ReqBody, ResBody, Locals>,
): ErrHandler<Route, ReqBody, ResBody, Locals>

function asyncHandler<
  Route extends string,
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
>(
  handler:
    | ReqHandler<Route, ReqBody, ResBody, Locals>
    | ErrHandler<Route, ReqBody, ResBody, Locals>,
):
  | ReqHandler<Route, ReqBody, ResBody, Locals>
  | ErrHandler<Route, ReqBody, ResBody, Locals> {
  if (handler.length === 2 || handler.length === 3) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const scoped: ReqHandler<Route, ReqBody, ResBody, Locals> = (
      req,
      res,
      next,
    ) =>
      Promise.resolve(
        (handler as ReqHandler<Route, ReqBody, ResBody, Locals>)(
          req,
          res,
          next,
        ),
      ).catch(next)
    return scoped
  } else if (handler.length === 4) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const scoped: ErrHandler<Route, ReqBody, ResBody, Locals> = (
      err,
      req,
      res,
      next,
    ) =>
      Promise.resolve(
        (handler as ErrHandler<Route, ReqBody, ResBody, Locals>)(
          err,
          req,
          res,
          next,
        ),
      ).catch(next)
    return scoped
  } else {
    throw new Error(`Failed to asyncHandle() function "${handler.name}"`)
  }
}

export default asyncHandler
