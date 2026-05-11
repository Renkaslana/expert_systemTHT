/**
 * Session mapper — Prisma row → API DTO.
 *
 * Note: inputSymptoms and rawResults are stored as JSON in DB. We pass them
 * through as-is in the response (frontend already knows the shape from its
 * own DiagnosisResult types).
 */
import type { ConsultationSession } from '@prisma/client'
import type { SymptomInput, CFEngineResult } from '@domain/cf/types.js'

export interface SessionDTO {
  sessionToken: string
  symptoms: SymptomInput[]
  results: CFEngineResult[]
  durationMs: number | null
  createdAt: string // ISO 8601
}

export function toSessionDTO(row: ConsultationSession): SessionDTO {
  return {
    sessionToken: row.sessionToken,
    symptoms: row.inputSymptoms as unknown as SymptomInput[],
    results: row.rawResults as unknown as CFEngineResult[],
    durationMs: row.durationMs,
    createdAt: row.createdAt.toISOString(),
  }
}
