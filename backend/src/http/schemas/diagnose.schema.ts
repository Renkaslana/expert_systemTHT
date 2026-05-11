/**
 * Validation schemas for POST /diagnose.
 */
import { z } from 'zod'
import { SymptomCodeSchema } from './common.schema.js'

const VALID_USER_WEIGHTS = [0.2, 0.4, 0.6, 0.8, 1.0] as const

export const SymptomInputSchema = z.object({
  symptomCode: SymptomCodeSchema,
  userWeight: z
    .number()
    .refine(
      (v) => (VALID_USER_WEIGHTS as readonly number[]).includes(v),
      `userWeight must be one of ${VALID_USER_WEIGHTS.join(', ')}`,
    ),
})

export const DiagnoseRequestSchema = z.object({
  symptoms: z
    .array(SymptomInputSchema)
    .min(1, 'symptoms must contain at least 1 item')
    .max(24, 'symptoms cannot exceed 24 items'),
  persistSession: z.boolean().optional().default(false),
})

export type DiagnoseRequest = z.infer<typeof DiagnoseRequestSchema>
