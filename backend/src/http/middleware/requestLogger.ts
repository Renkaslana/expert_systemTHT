/**
 * Lightweight request logger using morgan.
 *
 * Dev: colored, concise format.
 * Prod: combined Apache log format for log aggregation.
 */
import morgan from 'morgan'
import { config } from '@lib/config.js'

export const requestLogger = config.isDev
  ? morgan('dev')
  : morgan('combined', { skip: (_, res) => res.statusCode < 400 })
