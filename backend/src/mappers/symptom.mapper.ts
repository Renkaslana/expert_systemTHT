/**
 * Symptom mapper — Prisma row → API DTO matching frontend's Symptom interface
 * (src/types/index.ts).
 *
 * Strips internal-only fields (id, isActive, timestamps) from public response.
 */
import type { Symptom as PrismaSymptom } from '@prisma/client'

export interface SymptomDTO {
  code: string
  name: string
  nameEn: string
  category: 'telinga' | 'hidung' | 'tenggorokan' | 'umum'
  bodyArea: 'ear' | 'nose' | 'throat' | 'head' | 'general'
  severity: 'low' | 'medium' | 'high'
  description: string
}

export function toSymptomDTO(row: PrismaSymptom): SymptomDTO {
  return {
    code: row.code,
    name: row.name,
    nameEn: row.nameEn,
    category: row.category,
    bodyArea: row.bodyArea,
    severity: row.severity,
    description: row.description,
  }
}
