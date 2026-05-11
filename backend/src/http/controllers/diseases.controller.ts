/**
 * GET /api/v1/diseases       — list all
 * GET /api/v1/diseases/:code — single disease detail
 */
import type { RequestHandler } from 'express'
import { diseaseService } from '@services/disease.service.js'
import { DiseaseCodeSchema } from '@http/schemas/common.schema.js'
import { asyncHandler } from '@http/middleware/asyncHandler.js'

export const listDiseases: RequestHandler = asyncHandler(async (_req, res) => {
  const diseases = await diseaseService.listAll()
  res.json({
    success: true,
    data: { diseases },
    message: 'OK',
  })
})

export const getDiseaseByCode: RequestHandler = asyncHandler(async (req, res) => {
  const code = DiseaseCodeSchema.parse(req.params.code)
  const disease = await diseaseService.getByCode(code)
  res.json({
    success: true,
    data: { disease },
    message: 'OK',
  })
})
