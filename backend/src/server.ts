/**
 * Diagnova backend entry point.
 *
 * Boots the Express app, listens on configured port, and wires graceful
 * shutdown so in-flight requests finish and the DB connection is closed
 * cleanly when the process receives SIGINT/SIGTERM.
 */
import { createApp } from './app.js'
import { config } from '@lib/config.js'
import { logger } from '@lib/logger.js'
import { prisma } from '@lib/prisma.js'

async function main() {
  const app = createApp()

  const server = app.listen(config.PORT, () => {
    logger.info(`🚀 Diagnova API ready`, {
      env: config.NODE_ENV,
      port: config.PORT,
      url: `http://localhost:${config.PORT}${config.apiPrefix}`,
    })
  })

  // ── Graceful shutdown ──────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully…`)
    server.close(async () => {
      try {
        await prisma.$disconnect()
        logger.info('Database disconnected. Bye 👋')
        process.exit(0)
      } catch (err) {
        logger.error('Error during shutdown', { err: String(err) })
        process.exit(1)
      }
    })

    // Force-exit after 10s if cleanup hangs
    setTimeout(() => {
      logger.error('Forced shutdown after timeout')
      process.exit(1)
    }, 10_000).unref()
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { err: String(err), stack: err.stack })
    process.exit(1)
  })
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason: String(reason) })
    process.exit(1)
  })
}

main().catch((err) => {
  logger.error('Failed to start server', { err: String(err) })
  process.exit(1)
})
