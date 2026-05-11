/**
 * Disease mapper — Prisma row → API DTO matching frontend's Disease interface
 * (src/types/index.ts).
 */
import type { Disease as PrismaDisease } from '@prisma/client'

export interface DiseaseDTO {
  code: string
  name: string
  nameShort: string
  category: string
  severity: 'mild' | 'moderate' | 'severe'
  icdCode: string
  iconKey: 'ear' | 'nose' | 'throat' | 'sinus' | 'general'
  description: string
  causes: string[]
  generalSymptoms: string[]
  treatmentAdvice: string[]
  whenToSeeDoctor: string
  relatedDiseases: string[]
  expertSource: string
}

export function toDiseaseDTO(row: PrismaDisease): DiseaseDTO {
  return {
    code: row.code,
    name: row.name,
    nameShort: row.nameShort,
    category: row.category,
    severity: row.severity,
    icdCode: row.icdCode,
    iconKey: row.iconKey,
    description: row.description,
    causes: row.causes,
    generalSymptoms: row.generalSymptoms,
    treatmentAdvice: row.treatmentAdvice,
    whenToSeeDoctor: row.whenToSeeDoctor,
    relatedDiseases: row.relatedDiseases,
    expertSource: row.expertSource,
  }
}
