/**
 * Singleton PrismaClient.
 *
 * Reuses one instance across the app to avoid exhausting DB connections.
 * In dev with tsx watch, the global cache survives hot reloads.
 */
import { PrismaClient } from '@prisma/client'
import { config } from './config.js'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: config.isDev ? ['warn', 'error'] : ['error'],
  })

if (config.isDev) {
  global.__prisma = prisma
}
