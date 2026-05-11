/**
 * Reusable Zod schemas.
 */
import { z } from 'zod'

export const SymptomCodeSchema = z
  .string()
  .regex(/^G\d{3}$/, 'symptomCode must match pattern G### (e.g. G001)')

export const DiseaseCodeSchema = z
  .string()
  .regex(/^P\d{3}$/, 'diseaseCode must match pattern P### (e.g. P001)')

export const SymptomCategorySchema = z.enum(['telinga', 'hidung', 'tenggorokan', 'umum'])
