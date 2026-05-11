/**
 * CF Engine — domain types.
 *
 * These types describe the shape of input/output for the Certainty Factor
 * inference engine, independent of HTTP/DB concerns. The engine is a pure
 * function operating on these structures.
 *
 * Reference: Setyaputri, K.E., Fadlil, A., & Sunardi (2018).
 * Analisis Metode Certainty Factor pada Sistem Pakar Diagnosa Penyakit THT.
 * Jurnal Teknik Elektro Vol. 10 No. 1, Universitas Ahmad Dahlan.
 */

/** Allowed user confidence weights (5 discrete levels). */
export const VALID_USER_WEIGHTS = [0.2, 0.4, 0.6, 0.8, 1.0] as const
export type UserWeight = (typeof VALID_USER_WEIGHTS)[number]

/** Single user input: one symptom with its confidence weight. */
export interface SymptomInput {
  symptomCode: string // e.g. "G020"
  userWeight: number // must be one of VALID_USER_WEIGHTS
}

/** Knowledge base passed to the engine (loaded by repositories at the service layer). */
export interface KnowledgeBase {
  diseases: Array<{ code: string; name: string; category: string }>
  symptoms: Array<{ code: string; name: string }>
  rules: Array<{ diseaseCode: string; symptomCode: string; expertWeight: number }>
}

/** 4 confidence bands derived from final CF value. */
export type ConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low'

/** Per-symptom contribution data shown in the result panel. */
export interface SymptomContribution {
  symptomCode: string
  symptomName: string
  userWeight: number
  expertWeight: number
  cfValue: number // user × expert, 4 decimals
  contributionPercent: number // (cfValue / sum_of_cfValues) × 100, 1 decimal
}

/** One step of iterative CF combination — for explainability. */
export interface IterationStep {
  iteration: number // 1-based index (step 1 is the first combination)
  symptomCode: string
  symptomName: string
  cfBefore: number
  cfAdded: number
  cfAfter: number
  /** Human-readable formula, e.g. "0.480 + 0.240 × (1 − 0.480) = 0.604" */
  formula: string
}

/** One disease result. Top-3 returned. */
export interface CFEngineResult {
  diseaseCode: string
  diseaseName: string
  diseaseCategory: string
  cfValue: number // 0..1, 4 decimals
  cfPercentage: string // e.g. "91.7%"
  confidenceLevel: ConfidenceLevel
  rank: number // 1, 2, or 3
  contributingSymptoms: SymptomContribution[]
  iterationSteps: IterationStep[]
  explanation: string // natural Indonesian sentence
}

/** Engine version — bump when algorithm/output shape changes. */
export const ENGINE_VERSION = '1.0.0'

/** Minimum combined CF for a disease to appear in results. */
export const CF_MIN_THRESHOLD = 0.1

/** Maximum number of disease results returned. */
export const MAX_RESULTS = 3

/** Decimal precision for all intermediate and final CF values. */
export const CF_PRECISION = 4
