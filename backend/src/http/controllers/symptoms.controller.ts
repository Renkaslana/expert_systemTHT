/**
 * GET /api/v1/symptoms?category=...
 */
import type { RequestHandler } from 'express'
import { symptomService } from '@services/symptom.service.js'
import { SymptomCategorySchema } from '@http/schemas/common.schema.js'
import { asyncHandler } from '@http/middleware/asyncHandler.js'

export const listSymptoms: RequestHandler = asyncHandler(async (req, res) => {
  const rawCategory = req.query.category
  const category = rawCategory ? SymptomCategorySchema.parse(rawCategory) : undefined

  const symptoms = await symptomService.listAll({ category })

  res.json({
    success: true,
    data: { symptoms },
    message: 'OK',
  })
})
