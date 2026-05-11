/**
 * POST /api/v1/sessions       — save a session (standalone)
 * GET  /api/v1/sessions/:token — load by token
 */
import type { RequestHandler } from 'express'
import { createHash } from 'node:crypto'
import { sessionService } from '@services/session.service.js'
import {
  CreateSessionRequestSchema,
  SessionTokenSchema,
} from '@http/schemas/sessions.schema.js'
import { asyncHandler } from '@http/middleware/asyncHandler.js'

function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

export const createSession: RequestHandler = asyncHandler(async (req, res) => {
  const body = CreateSessionRequestSchema.parse(req.body)

  const { sessionToken } = await sessionService.create({
    symptoms: body.symptoms,
    results: body.results,
    ipHash: hashIp(req.ip),
    userAgent: req.get('user-agent') ?? undefined,
  })

  res.status(201).json({
    success: true,
    data: { sessionToken },
    message: 'Session saved',
  })
})

export const getSession: RequestHandler = asyncHandler(async (req, res) => {
  const token = SessionTokenSchema.parse(req.params.token)
  const session = await sessionService.getByToken(token)

  res.json({
    success: true,
    data: session,
    message: 'OK',
  })
})
