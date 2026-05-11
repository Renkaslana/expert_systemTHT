/**
 * Minimal structured logger.
 *
 * Rationale: avoid heavy dependencies (pino, winston) for now. If structured
 * logging becomes important we can swap implementation without touching
 * call sites.
 */
import { config } from './config.js'

type Level = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_PRIORITY: Record<Level, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function shouldLog(level: Level): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[config.LOG_LEVEL]
}

function format(level: Level, message: string, meta?: Record<string, unknown>): string {
  const ts = new Date().toISOString()
  const base = `[${ts}] ${level.toUpperCase().padEnd(5)} ${message}`
  if (meta && Object.keys(meta).length > 0) {
    return `${base} ${JSON.stringify(meta)}`
  }
  return base
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('debug')) console.info(format('debug', message, meta))
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('info')) console.info(format('info', message, meta))
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn(format('warn', message, meta))
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('error')) console.error(format('error', message, meta))
  },
}
