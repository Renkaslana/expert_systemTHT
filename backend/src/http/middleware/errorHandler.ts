/**
 * Centralized error handler.
 *
 * Catches everything thrown by route handlers. Returns standardized
 * `{ success: false, error: { code, message, details? } }` payload.
 */
import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { logger } from '@lib/logger.js'
import { config } from '@lib/config.js'
import { ApiError } from '@lib/errors.js'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Zod validation error → 400
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten().fieldErrors,
      },
    })
    return
  }

  // Custom typed application error
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    })
    return
  }

  // Unknown error → 500
  const message = err instanceof Error ? err.message : String(err)
  logger.error('Unhandled error', {
    method: req.method,
    path: req.path,
    message,
    stack: err instanceof Error ? err.stack : undefined,
  })

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.isProd ? 'An unexpected error occurred' : message,
    },
  })
}
