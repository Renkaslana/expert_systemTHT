/**
 * Wraps an async route handler so thrown errors propagate to errorHandler.
 *
 * Express 4 doesn't automatically catch rejected promises — without this,
 * a thrown ApiError in an async controller would hang the request.
 */
import type { NextFunction, Request, RequestHandler, Response } from 'express'

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
