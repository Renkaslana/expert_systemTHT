/**
 * Validation schemas for session endpoints.
 *
 * POST /sessions accepts a previously-computed result + the input that
 * produced it, so frontend can save *after* showing the result page.
 * Backend trusts the client's CF values here (saved-result use case), but
 * still validates shape.
 */
import { z } from 'zod'
import { SymptomInputSchema } from './diagnose.schema.js'
import { SymptomCodeSchema, DiseaseCodeSchema } from './common.schema.js'

const ConfidenceLevelSchema = z.enum(['very_high', 'high', 'medium', 'low'])

const SymptomContributionSchema = z.object({
  symptomCode: SymptomCodeSchema,
  symptomName: z.string(),
  userWeight: z.number(),
  expertWeight: z.number(),
  cfValue: z.number(),
  contributionPercent: z.number(),
})

const IterationStepSchema = z.object({
  iteration: z.number().int().positive(),
  symptomCode: SymptomCodeSchema,
  symptomName: z.string(),
  cfBefore: z.number(),
  cfAdded: z.number(),
  cfAfter: z.number(),
  formula: z.string(),
})

const CFEngineResultSchema = z.object({
  diseaseCode: DiseaseCodeSchema,
  diseaseName: z.string(),
  diseaseCategory: z.string(),
  cfValue: z.number().min(0).max(1),
  cfPercentage: z.string(),
  confidenceLevel: ConfidenceLevelSchema,
  rank: z.number().int().min(1).max(3),
  contributingSymptoms: z.array(SymptomContributionSchema),
  iterationSteps: z.array(IterationStepSchema),
  explanation: z.string(),
})

export const CreateSessionRequestSchema = z.object({
  symptoms: z.array(SymptomInputSchema).min(1).max(24),
  results: z.array(CFEngineResultSchema).min(1).max(3),
})

export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>

export const SessionTokenSchema = z
  .string()
  .min(20, 'sessionToken too short')
  .max(40, 'sessionToken too long')
  .regex(/^[a-z0-9]+$/, 'sessionToken must be alphanumeric lowercase')
