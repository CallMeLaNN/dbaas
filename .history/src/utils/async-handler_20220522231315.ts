import type { ErrorRequestHandler, RequestHandler } from "express"
// eslint-disable-next-line node/no-missing-import
import type { ParamsDictionary } from "express-serve-static-core"
// eslint-disable-next-line node/no-extraneous-import
import type { ParsedQs } from "qs"

type ReqHandler<
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
> = RequestHandler<ParamsDictionary, ResBody, ReqBody, ParsedQs, Locals>

type ErrHandler<
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
> = ErrorRequestHandler<ParamsDictionary, ResBody, ReqBody, ParsedQs, Locals>

/**
 * Handles promises in routes.
 */
function asyncHandler<
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
>(
  handler: ReqHandler<ReqBody, ResBody, Locals>,
): ReqHandler<ReqBody, ResBody, Locals>

function asyncHandler<
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
>(
  handler: ErrHandler<ReqBody, ResBody, Locals>,
): ErrHandler<ReqBody, ResBody, Locals>

function asyncHandler<
  ReqBody = unknown,
  ResBody = unknown,
  Locals = Record<string, unknown>,
>(
  handler:
    | ReqHandler<ReqBody, ResBody, Locals>
    | ErrHandler<ReqBody, ResBody, Locals>,
): ReqHandler<ReqBody, ResBody, Locals> | ErrHandler<ReqBody, ResBody, Locals> {
  if (handler.length === 2 || handler.length === 3) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const scoped: ReqHandler<ReqBody, ResBody, Locals> = (req, res, next) =>
      Promise.resolve(
        (handler as ReqHandler<ReqBody, ResBody, Locals>)(req, res, next),
      ).catch(next)
    return scoped
  } else if (handler.length === 4) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const scoped: ErrHandler<ReqBody, ResBody, Locals> = (
      err,
      req,
      res,
      next,
    ) =>
      Promise.resolve(
        (handler as ErrHandler<ReqBody, ResBody, Locals>)(err, req, res, next),
      ).catch(next)
    return scoped
  } else {
    throw new Error(`Failed to asyncHandle() function "${handler.name}"`)
  }
}

export default asyncHandler
