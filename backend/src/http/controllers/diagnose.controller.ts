/**
 * POST /api/v1/diagnose — core CF inference endpoint.
 */
import type { RequestHandler } from 'express'
import { createHash } from 'node:crypto'
import { diagnosisService } from '@services/diagnosis.service.js'
import { DiagnoseRequestSchema } from '@http/schemas/diagnose.schema.js'
import { asyncHandler } from '@http/middleware/asyncHandler.js'

/** Hash a request IP for soft analytics — never store plaintext IP. */
function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

export const diagnose: RequestHandler = asyncHandler(async (req, res) => {
  const body = DiagnoseRequestSchema.parse(req.body)

  const result = await diagnosisService.diagnose({
    symptoms: body.symptoms,
    persistSession: body.persistSession,
    ipHash: hashIp(req.ip),
    userAgent: req.get('user-agent') ?? undefined,
  })

  res.json({
    success: true,
    data: result,
    message: 'OK',
  })
})
