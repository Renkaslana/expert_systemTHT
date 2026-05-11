/**
 * Session service — save & load consultation sessions.
 *
 * Two save paths:
 *   1. Inline at /diagnose (with `persistSession: true`)
 *      → diagnosisService handles it, calls sessionRepo directly.
 *   2. Standalone POST /sessions
 *      → for clients that compute first, then optionally save later.
 *
 * Single load path: GET /sessions/:token → returns full input + result.
 */
import { sessionRepo } from '@repositories/session.repo.js'
import { diseaseRepo } from '@repositories/disease.repo.js'
import { toSessionDTO, type SessionDTO } from '@mappers/session.mapper.js'
import { ApiError } from '@lib/errors.js'
import type { SymptomInput, CFEngineResult } from '@domain/cf/types.js'

export interface CreateSessionInput {
  symptoms: SymptomInput[]
  results: CFEngineResult[]
  ipHash?: string
  userAgent?: string
}

export const sessionService = {
  async create(input: CreateSessionInput): Promise<{ sessionToken: string }> {
    // Resolve disease IDs for the denormalized ConsultationResult rows.
    const diseaseRows = await diseaseRepo.findAll()
    const diseaseIdByCode = new Map(diseaseRows.map((d) => [d.code, d.id]))

    const topResults = input.results
      .map((r) => {
        const diseaseId = diseaseIdByCode.get(r.diseaseCode)
        return diseaseId
          ? { diseaseId, cfValue: r.cfValue, rank: r.rank }
          : null
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)

    if (topResults.length === 0) {
      throw ApiError.badRequest(
        'Cannot save session: none of the result diseaseCodes match the knowledge base',
      )
    }

    const session = await sessionRepo.create({
      inputSymptoms: input.symptoms as unknown as Parameters<
        typeof sessionRepo.create
      >[0]['inputSymptoms'],
      rawResults: input.results as unknown as Parameters<
        typeof sessionRepo.create
      >[0]['rawResults'],
      ipHash: input.ipHash,
      userAgent: input.userAgent,
      topResults,
    })

    return { sessionToken: session.sessionToken }
  },

  async getByToken(token: string): Promise<SessionDTO> {
    const row = await sessionRepo.findByToken(token)
    if (!row) {
      throw ApiError.notFound(`Session not found for token: ${token}`)
    }
    return toSessionDTO(row)
  },
}
