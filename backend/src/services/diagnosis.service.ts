/**
 * Diagnosis service — orchestrates the CF engine with the live KB.
 *
 * Responsibility:
 *   1. Load full knowledge base from repositories
 *   2. Pass to pure cfEngine.runDiagnosis
 *   3. Optionally persist as ConsultationSession
 *   4. Convert engine errors → ApiError for the HTTP layer
 *   5. Measure engine duration for telemetry
 */
import { runDiagnosis, CFEngineError } from '@domain/cf/cfEngine.js'
import { ENGINE_VERSION } from '@domain/cf/types.js'
import type { CFEngineResult, KnowledgeBase, SymptomInput } from '@domain/cf/types.js'
import { symptomRepo } from '@repositories/symptom.repo.js'
import { diseaseRepo } from '@repositories/disease.repo.js'
import { ruleRepo } from '@repositories/rule.repo.js'
import { sessionRepo } from '@repositories/session.repo.js'
import { ApiError } from '@lib/errors.js'

export interface DiagnoseInput {
  symptoms: SymptomInput[]
  persistSession: boolean
  ipHash?: string
  userAgent?: string
}

export interface DiagnoseOutput {
  results: CFEngineResult[]
  sessionToken?: string
  meta: {
    inputCount: number
    durationMs: number
    engineVersion: string
  }
}

async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  const [symptoms, diseases, rules] = await Promise.all([
    symptomRepo.findAll(),
    diseaseRepo.findAll(),
    ruleRepo.findAll(),
  ])
  return {
    symptoms: symptoms.map((s) => ({ code: s.code, name: s.name })),
    diseases: diseases.map((d) => ({
      code: d.code,
      name: d.name,
      category: d.category,
    })),
    rules: rules.map((r) => ({
      diseaseCode: r.diseaseCode,
      symptomCode: r.symptomCode,
      expertWeight: r.expertWeight,
    })),
  }
}

function mapEngineErrorToApi(err: CFEngineError): ApiError {
  switch (err.kind) {
    case 'INVALID_USER_WEIGHT':
      return ApiError.badRequest(err.message, err.details)
    case 'UNKNOWN_SYMPTOM_CODE':
      return ApiError.badRequest(err.message, err.details)
    case 'DUPLICATE_SYMPTOM':
      return ApiError.badRequest(err.message, err.details)
    default:
      return ApiError.badRequest(err.message)
  }
}

export const diagnosisService = {
  async diagnose(input: DiagnoseInput): Promise<DiagnoseOutput> {
    const t0 = Date.now()

    const kb = await loadKnowledgeBase()

    let results: CFEngineResult[]
    try {
      results = runDiagnosis(input.symptoms, kb)
    } catch (err) {
      if (err instanceof CFEngineError) throw mapEngineErrorToApi(err)
      throw err
    }

    const durationMs = Date.now() - t0

    let sessionToken: string | undefined
    if (input.persistSession && results.length > 0) {
      const diseaseRows = await diseaseRepo.findAll()
      const diseaseIdByCode = new Map(diseaseRows.map((d) => [d.code, d.id]))

      const session = await sessionRepo.create({
        inputSymptoms: input.symptoms as unknown as Parameters<
          typeof sessionRepo.create
        >[0]['inputSymptoms'],
        rawResults: results as unknown as Parameters<
          typeof sessionRepo.create
        >[0]['rawResults'],
        durationMs,
        ipHash: input.ipHash,
        userAgent: input.userAgent,
        topResults: results
          .map((r) => {
            const diseaseId = diseaseIdByCode.get(r.diseaseCode)
            return diseaseId
              ? { diseaseId, cfValue: r.cfValue, rank: r.rank }
              : null
          })
          .filter((x): x is NonNullable<typeof x> => x !== null),
      })
      sessionToken = session.sessionToken
    }

    return {
      results,
      ...(sessionToken ? { sessionToken } : {}),
      meta: {
        inputCount: input.symptoms.length,
        durationMs,
        engineVersion: ENGINE_VERSION,
      },
    }
  },
}
