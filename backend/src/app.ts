/**
 * Express application factory.
 *
 * Returns a configured Express app WITHOUT starting it. This separation
 * makes the app testable with supertest (no real port binding required).
 */
import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { config } from '@lib/config.js'
import { apiRouter } from '@http/routes/index.js'
import { requestLogger } from '@http/middleware/requestLogger.js'
import { notFound } from '@http/middleware/notFound.js'
import { errorHandler } from '@http/middleware/errorHandler.js'

export function createApp(): Express {
  const app = express()

  // ── Security headers ─────────────────────────────────────────────
  // For a JSON API consumed from a different origin (Vite :5173 → :3001),
  // the default Helmet preset is too strict and triggers browser-level
  // blocks BEFORE the response body reaches the frontend:
  //   • Cross-Origin-Resource-Policy: same-origin → blocks cross-origin reads
  //   • Cross-Origin-Embedder-Policy → blocks embedding
  //   • Strict-Transport-Security on http://localhost → can confuse Firefox
  //   • Content-Security-Policy → meaningless for JSON, conflicts with CORS
  // We disable the embedder/CSP/HSTS and explicitly allow cross-origin for
  // CORP/COOP. Other helmet protections (nosniff, frameguard, etc) stay on.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'unsafe-none' },
      contentSecurityPolicy: false,
      strictTransportSecurity: config.isProd
        ? { maxAge: 31_536_000, includeSubDomains: true }
        : false,
    }),
  )

  // ── CORS ─────────────────────────────────────────────────────────
  // maxAge=0 in dev prevents Firefox/Chrome from caching the preflight
  // response — useful while iterating on CORS config. In prod we let
  // the browser cache for 1 hour (3600s).
  app.use(
    cors({
      origin: config.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
      maxAge: config.isProd ? 3600 : 0,
    }),
  )

  // Explicit OPTIONS handler — some browsers fall back to this when
  // automatic preflight handling by cors() middleware races with helmet.
  app.options('*', cors())

  // ── Body parsing ─────────────────────────────────────────────────
  app.use(express.json({ limit: '256kb' }))
  app.use(express.urlencoded({ extended: false, limit: '256kb' }))

  // ── Request logging ──────────────────────────────────────────────
  app.use(requestLogger)

  // ── Routes ───────────────────────────────────────────────────────
  app.use(config.apiPrefix, apiRouter)

  // ── 404 fallback ─────────────────────────────────────────────────
  app.use(notFound)

  // ── Global error handler (must be last) ──────────────────────────
  app.use(errorHandler)

  return app
}
