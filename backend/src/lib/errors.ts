/**
 * Typed application errors.
 *
 * Throw these from services/controllers; the global errorHandler will
 * render them as a standardized JSON response with the correct status code.
 */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'INVALID_INPUT'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly statusCode: number
  readonly details?: unknown

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static notFound(message: string, details?: unknown): ApiError {
    return new ApiError('NOT_FOUND', message, 404, details)
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError('INVALID_INPUT', message, 400, details)
  }

  static conflict(message: string, details?: unknown): ApiError {
    return new ApiError('CONFLICT', message, 409, details)
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError('UNAUTHORIZED', message, 401)
  }

  static rateLimited(message = 'Too many requests'): ApiError {
    return new ApiError('RATE_LIMITED', message, 429)
  }
}
