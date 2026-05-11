/**
 * GET /api/v1/cf-rules?diseaseCode=...&symptomCode=...
 */
import type { RequestHandler } from 'express'
import { ruleService } from '@services/rule.service.js'
import {
  DiseaseCodeSchema,
  SymptomCodeSchema,
} from '@http/schemas/common.schema.js'
import { asyncHandler } from '@http/middleware/asyncHandler.js'

export const listCfRules: RequestHandler = asyncHandler(async (req, res) => {
  const diseaseCode = req.query.diseaseCode
    ? DiseaseCodeSchema.parse(req.query.diseaseCode)
    : undefined
  const symptomCode = req.query.symptomCode
    ? SymptomCodeSchema.parse(req.query.symptomCode)
    : undefined

  const rules = await ruleService.listAll({ diseaseCode, symptomCode })

  res.json({
    success: true,
    data: { rules },
    message: 'OK',
  })
})
