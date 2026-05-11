/**
 * 404 fallback for unmatched routes. Returns standardized error payload.
 */
import type { RequestHandler } from 'express'

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  })
}
