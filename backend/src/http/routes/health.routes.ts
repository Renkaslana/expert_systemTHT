/**
 * Health check endpoint.
 *
 * Used for liveness/readiness probes by deployment platforms (Railway,
 * Fly.io, Kubernetes). Verifies process is up AND database is reachable.
 */
import { Router } from 'express'
import { prisma } from '@lib/prisma.js'

export const healthRouter: Router = Router()

healthRouter.get('/health', async (_req, res) => {
  let dbConnected = false
  try {
    await prisma.$queryRaw`SELECT 1`
    dbConnected = true
  } catch {
    dbConnected = false
  }

  res.status(dbConnected ? 200 : 503).json({
    success: true,
    data: {
      status: dbConnected ? 'ok' : 'degraded',
      uptime: Math.round(process.uptime()),
      dbConnected,
      timestamp: new Date().toISOString(),
    },
    message: dbConnected ? 'Service healthy' : 'Database unreachable',
  })
})
