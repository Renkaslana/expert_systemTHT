/**
 * CF Explainer — produces natural-language Indonesian explanations for
 * a diagnosis result.
 *
 * Pure functions. No I/O. The engine calls these to populate
 * `CFEngineResult.explanation` and the human-readable `formula` strings
 * inside iteration steps.
 */
import type { ConfidenceLevel } from './types.js'

/** Indonesian phrasing for each confidence band. */
const LEVEL_TEXT_ID: Record<ConfidenceLevel, string> = {
  very_high: 'sangat tinggi',
  high: 'tinggi',
  medium: 'cukup',
  low: 'rendah',
}

/**
 * Build a single-paragraph Indonesian explanation summarizing the diagnosis.
 *
 * Format:
 *   "Sistem mendiagnosis {disease} dengan tingkat keyakinan {level}.
 *    Gejala paling berkontribusi: {top1}, {top2}, {top3}."
 *
 * If no contributing symptoms (shouldn't happen — engine drops such
 * candidates — but defensive), produces a fallback message.
 *
 * @param diseaseName  e.g. "Otitis Media Akut"
 * @param level        Confidence band derived from final CF.
 * @param topSymptoms  Pre-sorted list of symptom names (highest contribution first).
 *                     Up to 3 will be shown.
 */
export function buildExplanation(
  diseaseName: string,
  level: ConfidenceLevel,
  topSymptoms: string[],
): string {
  const levelText = LEVEL_TEXT_ID[level]

  if (topSymptoms.length === 0) {
    return `Sistem mendiagnosis ${diseaseName} dengan tingkat keyakinan ${levelText}.`
  }

  const symptomsList = topSymptoms.slice(0, 3).join(', ')
  return `Sistem mendiagnosis ${diseaseName} dengan tingkat keyakinan ${levelText}. Gejala paling berkontribusi: ${symptomsList}.`
}

/**
 * Format the iteration-step formula in the journal's notation:
 *   "0.480 + 0.240 × (1 − 0.480) = 0.604"
 *
 * Used when constructing IterationStep entries; exposed here for testing
 * and for any UI that wants to render formulas separately.
 */
export function formatIterationFormula(
  cfBefore: number,
  cfAdded: number,
  cfAfter: number,
): string {
  return `${cfBefore.toFixed(3)} + ${cfAdded.toFixed(3)} × (1 − ${cfBefore.toFixed(3)}) = ${cfAfter.toFixed(3)}`
}
