/**
 * Certainty Factor inference engine — pure, deterministic, framework-agnostic.
 *
 * Implements the MYCIN-style Certainty Factor combination as described in:
 *   Setyaputri, Fadlil & Sunardi (2018). Jurnal Teknik Elektro Vol. 10 No. 1.
 *   Universitas Ahmad Dahlan, Yogyakarta.
 *
 * Algorithm (forward-chaining over disease set):
 *   1. For each disease D in the knowledge base:
 *      a. Find all rules linking D to the user's selected symptoms.
 *      b. For each such rule, compute cf_i = userWeight_i × expertWeight_i.
 *      c. Sort cf values descending (so the strongest evidence anchors the
 *         combination — produces the most stable iteration trace).
 *      d. Iteratively combine using:
 *           cf_combined[n] = cf_combined[n-1] + cf_n × (1 − cf_combined[n-1])
 *      e. If cf_combined < CF_MIN_THRESHOLD, drop this disease.
 *   2. Sort surviving diseases by cf_combined descending.
 *   3. Take top MAX_RESULTS, assign rank 1..N.
 *
 * Mathematical note: the combination operator IS commutative, so sort order
 * does not change the final cf_combined. We sort for readable iteration steps.
 *
 * NO DB calls, NO I/O, NO globals. Caller passes KnowledgeBase explicitly.
 */
import type {
  CFEngineResult,
  ConfidenceLevel,
  IterationStep,
  KnowledgeBase,
  SymptomContribution,
  SymptomInput,
} from './types.js'
import {
  CF_MIN_THRESHOLD,
  CF_PRECISION,
  MAX_RESULTS,
  VALID_USER_WEIGHTS,
} from './types.js'
import { buildExplanation } from './cfExplainer.js'

// ─────────────────────────────────────────────────────────────────────
// Errors — typed, so callers can react with proper HTTP status
// ─────────────────────────────────────────────────────────────────────

export class CFEngineError extends Error {
  constructor(
    public readonly kind:
      | 'INVALID_USER_WEIGHT'
      | 'UNKNOWN_SYMPTOM_CODE'
      | 'DUPLICATE_SYMPTOM',
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'CFEngineError'
    Object.setPrototypeOf(this, CFEngineError.prototype)
  }
}

// ─────────────────────────────────────────────────────────────────────
// Helpers — pure, exported for unit testing
// ─────────────────────────────────────────────────────────────────────

/** Round a number to CF_PRECISION decimal places (default 4). */
export function roundCF(value: number): number {
  return parseFloat(value.toFixed(CF_PRECISION))
}

/** Compute single-rule CF: user × expert, rounded. */
export function computeSingleCF(userWeight: number, expertWeight: number): number {
  return roundCF(userWeight * expertWeight)
}

/**
 * MYCIN combination operator (no negative CFs supported — the journal's
 * formulation only uses positive expert weights).
 *
 *   combineCF(a, b) = a + b × (1 − a)
 *
 * Idempotent at boundaries: combineCF(0, x) = x, combineCF(x, 0) = x,
 * combineCF(1, x) = 1, combineCF(x, 1) = 1.
 *
 * Commutative: combineCF(a, b) === combineCF(b, a).
 */
export function combineCF(a: number, b: number): number {
  return roundCF(a + b * (1 - a))
}

/** Map final CF value to a 4-band confidence label. */
export function levelFromCF(cf: number): ConfidenceLevel {
  if (cf >= 0.8) return 'very_high'
  if (cf >= 0.6) return 'high'
  if (cf >= 0.4) return 'medium'
  return 'low'
}

/** Format CF as percentage string with 1 decimal, e.g. 0.8965 → "89.7%". */
export function formatCFPercent(cf: number): string {
  return `${(cf * 100).toFixed(1)}%`
}

// ─────────────────────────────────────────────────────────────────────
// Input validation
// ─────────────────────────────────────────────────────────────────────

/**
 * Validate user inputs against the knowledge base.
 *
 * Checks:
 *   - Each userWeight is one of [0.2, 0.4, 0.6, 0.8, 1.0]
 *   - Each symptomCode exists in the KB
 *   - No duplicate symptomCode across inputs
 *
 * Throws CFEngineError on any violation.
 */
export function validateInputs(inputs: SymptomInput[], kb: KnowledgeBase): void {
  const knownCodes = new Set(kb.symptoms.map((s) => s.code))
  const seen = new Set<string>()

  for (const input of inputs) {
    if (!VALID_USER_WEIGHTS.includes(input.userWeight as never)) {
      throw new CFEngineError(
        'INVALID_USER_WEIGHT',
        `userWeight must be one of ${VALID_USER_WEIGHTS.join(', ')}; got ${input.userWeight} for ${input.symptomCode}`,
        { symptomCode: input.symptomCode, userWeight: input.userWeight },
      )
    }
    if (!knownCodes.has(input.symptomCode)) {
      throw new CFEngineError(
        'UNKNOWN_SYMPTOM_CODE',
        `Unknown symptom code: ${input.symptomCode}`,
        { symptomCode: input.symptomCode },
      )
    }
    if (seen.has(input.symptomCode)) {
      throw new CFEngineError(
        'DUPLICATE_SYMPTOM',
        `Duplicate symptom in input: ${input.symptomCode}`,
        { symptomCode: input.symptomCode },
      )
    }
    seen.add(input.symptomCode)
  }
}

// ─────────────────────────────────────────────────────────────────────
// Per-disease evaluation
// ─────────────────────────────────────────────────────────────────────

interface MatchedPair {
  symptomCode: string
  symptomName: string
  userWeight: number
  expertWeight: number
  cfValue: number
}

/** Build the list of (rule, userWeight) pairs for a disease, then compute cf_i. */
function matchPairsForDisease(
  diseaseCode: string,
  inputsByCode: Map<string, number>,
  kb: KnowledgeBase,
): MatchedPair[] {
  const symptomNameByCode = new Map(kb.symptoms.map((s) => [s.code, s.name]))
  const pairs: MatchedPair[] = []

  for (const rule of kb.rules) {
    if (rule.diseaseCode !== diseaseCode) continue
    const userWeight = inputsByCode.get(rule.symptomCode)
    if (userWeight === undefined) continue
    pairs.push({
      symptomCode: rule.symptomCode,
      symptomName: symptomNameByCode.get(rule.symptomCode) ?? rule.symptomCode,
      userWeight,
      expertWeight: rule.expertWeight,
      cfValue: computeSingleCF(userWeight, rule.expertWeight),
    })
  }

  // Strongest evidence first → cleaner iteration steps for explainability.
  pairs.sort((a, b) => b.cfValue - a.cfValue)
  return pairs
}

/** Run iterative CF combination, recording each step. */
function combinePairsWithTrace(pairs: MatchedPair[]): {
  cfFinal: number
  steps: IterationStep[]
} {
  if (pairs.length === 0) return { cfFinal: 0, steps: [] }

  // Single matching rule: cf_combined === cfValue, no iteration steps.
  const firstPair = pairs[0]!
  let cfCombined = firstPair.cfValue
  const steps: IterationStep[] = []

  for (let i = 1; i < pairs.length; i++) {
    const pair = pairs[i]!
    const cfBefore = cfCombined
    const cfAdded = pair.cfValue
    const cfAfter = combineCF(cfBefore, cfAdded)
    steps.push({
      iteration: i,
      symptomCode: pair.symptomCode,
      symptomName: pair.symptomName,
      cfBefore,
      cfAdded,
      cfAfter,
      formula: `${cfBefore.toFixed(3)} + ${cfAdded.toFixed(3)} × (1 − ${cfBefore.toFixed(3)}) = ${cfAfter.toFixed(3)}`,
    })
    cfCombined = cfAfter
  }

  return { cfFinal: cfCombined, steps }
}

/** Build per-symptom contribution percentages. */
function buildContributions(pairs: MatchedPair[]): SymptomContribution[] {
  const total = pairs.reduce((sum, p) => sum + p.cfValue, 0)
  return pairs.map((p) => ({
    symptomCode: p.symptomCode,
    symptomName: p.symptomName,
    userWeight: p.userWeight,
    expertWeight: p.expertWeight,
    cfValue: p.cfValue,
    contributionPercent:
      total > 0 ? parseFloat(((p.cfValue / total) * 100).toFixed(1)) : 0,
  }))
}

// ─────────────────────────────────────────────────────────────────────
// Main entry
// ─────────────────────────────────────────────────────────────────────

/**
 * Run forward-chaining CF inference and return ranked disease hypotheses.
 *
 * @param inputs   User-selected symptoms with confidence weights.
 * @param kb       Full knowledge base (diseases, symptoms, rules).
 * @returns        Top {@link MAX_RESULTS} disease results sorted by CF desc.
 *                 Each result includes per-symptom contributions and the
 *                 iterative combination trace.
 *
 * @throws CFEngineError on invalid inputs (unknown symptom, bad weight,
 *                       duplicate code).
 *
 * Edge cases:
 *   • Empty input → []
 *   • All diseases below CF_MIN_THRESHOLD (0.1) → []
 *   • Single matching rule for a disease → cfValue used directly,
 *     iterationSteps will be empty.
 *   • Tied CF values across diseases → stable sort preserves KB order.
 */
export function runDiagnosis(
  inputs: SymptomInput[],
  kb: KnowledgeBase,
): CFEngineResult[] {
  // Defensive: empty input short-circuit (don't even validate KB shape).
  if (inputs.length === 0) return []

  validateInputs(inputs, kb)

  const inputsByCode = new Map(inputs.map((i) => [i.symptomCode, i.userWeight]))
  const diseaseInfoByCode = new Map(
    kb.diseases.map((d) => [d.code, { name: d.name, category: d.category }]),
  )

  // Iterate diseases in KB order → deterministic tie-breaking.
  const candidates: CFEngineResult[] = []

  for (const disease of kb.diseases) {
    const pairs = matchPairsForDisease(disease.code, inputsByCode, kb)
    if (pairs.length === 0) continue

    const { cfFinal, steps } = combinePairsWithTrace(pairs)
    if (cfFinal < CF_MIN_THRESHOLD) continue

    const info = diseaseInfoByCode.get(disease.code) ?? {
      name: disease.code,
      category: '',
    }

    const level = levelFromCF(cfFinal)
    const contributions = buildContributions(pairs)

    candidates.push({
      diseaseCode: disease.code,
      diseaseName: info.name,
      diseaseCategory: info.category,
      cfValue: cfFinal,
      cfPercentage: formatCFPercent(cfFinal),
      confidenceLevel: level,
      rank: 0, // assigned after final sort
      contributingSymptoms: contributions,
      iterationSteps: steps,
      explanation: buildExplanation(
        info.name,
        level,
        contributions.map((c) => c.symptomName),
      ),
    })
  }

  // Stable sort by CF desc, then take top N, then assign rank.
  candidates.sort((a, b) => b.cfValue - a.cfValue)
  return candidates.slice(0, MAX_RESULTS).map((r, i) => ({
    ...r,
    rank: i + 1,
  }))
}
