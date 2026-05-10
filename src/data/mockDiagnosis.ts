import type { ConfidenceLevel, DiagnosisResult } from '@/types'
import { CF_RULES, DISEASE_BY_CODE } from './diseases'
import { SYMPTOM_BY_CODE } from './symptoms'

/**
 * MOCK diagnosis generator for the FRONTEND PROTOTYPE.
 * This is intentionally NOT the real Certainty Factor engine — it produces
 * plausible-looking numbers from the selected symptoms so the UI can be
 * designed and reviewed end-to-end. Replace with the real engine later.
 */

function levelFromCF(cf: number): ConfidenceLevel {
  if (cf >= 0.8) return 'very_high'
  if (cf >= 0.6) return 'high'
  if (cf >= 0.4) return 'medium'
  return 'low'
}

function buildExplanation(diseaseName: string, level: ConfidenceLevel, top: string[]): string {
  const levelText = {
    very_high: 'sangat tinggi',
    high: 'tinggi',
    medium: 'cukup',
    low: 'rendah',
  }[level]
  const symptomsList = top.slice(0, 3).join(', ')
  return `Sistem mendiagnosis ${diseaseName} dengan tingkat keyakinan ${levelText}. Gejala paling berkontribusi: ${symptomsList}.`
}

export function mockDiagnose(
  selected: Map<string, number>,
): DiagnosisResult[] {
  const results: DiagnosisResult[] = []

  const diseaseCodes = Array.from(new Set(CF_RULES.map((r) => r.diseaseCode)))

  for (const diseaseCode of diseaseCodes) {
    const disease = DISEASE_BY_CODE[diseaseCode]
    if (!disease) continue

    const rulesForDisease = CF_RULES.filter((r) => r.diseaseCode === diseaseCode)
    const cfPairs: { rule: (typeof rulesForDisease)[number]; userWeight: number; cfValue: number }[] = []

    for (const rule of rulesForDisease) {
      const userWeight = selected.get(rule.symptomCode)
      if (!userWeight || userWeight === 0) continue
      const cfValue = parseFloat((userWeight * rule.expertWeight).toFixed(4))
      cfPairs.push({ rule, userWeight, cfValue })
    }

    if (cfPairs.length === 0) continue

    cfPairs.sort((a, b) => b.cfValue - a.cfValue)

    let cfCombined = cfPairs[0].cfValue
    const iterationSteps = []

    for (let i = 1; i < cfPairs.length; i++) {
      const cf2 = cfPairs[i].cfValue
      const cfBefore = cfCombined
      const newCF = cfCombined + cf2 * (1 - cfCombined)
      cfCombined = parseFloat(newCF.toFixed(4))
      iterationSteps.push({
        iteration: i,
        symptomCode: cfPairs[i].rule.symptomCode,
        symptomName: SYMPTOM_BY_CODE[cfPairs[i].rule.symptomCode]?.name ?? cfPairs[i].rule.symptomCode,
        cfBefore,
        cfAdded: cf2,
        cfAfter: cfCombined,
        formula: `${cfBefore.toFixed(3)} + ${cf2.toFixed(3)} × (1 − ${cfBefore.toFixed(3)}) = ${cfCombined.toFixed(3)}`,
      })
    }

    if (cfCombined < 0.1) continue

    const totalCF = cfPairs.reduce((sum, p) => sum + p.cfValue, 0)
    const contributingSymptoms = cfPairs.map((p) => ({
      symptomCode: p.rule.symptomCode,
      symptomName: SYMPTOM_BY_CODE[p.rule.symptomCode]?.name ?? p.rule.symptomCode,
      userWeight: p.userWeight,
      expertWeight: p.rule.expertWeight,
      cfValue: p.cfValue,
      contributionPercent: parseFloat(((p.cfValue / totalCF) * 100).toFixed(1)),
    }))

    const level = levelFromCF(cfCombined)
    results.push({
      diseaseCode,
      diseaseName: disease.name,
      diseaseCategory: disease.category,
      cfValue: cfCombined,
      cfPercentage: `${(cfCombined * 100).toFixed(1)}%`,
      confidenceLevel: level,
      rank: 0,
      contributingSymptoms,
      iterationSteps,
      explanation: buildExplanation(
        disease.name,
        level,
        contributingSymptoms.map((s) => s.symptomName),
      ),
    })
  }

  return results
    .sort((a, b) => b.cfValue - a.cfValue)
    .slice(0, 3)
    .map((r, i) => ({ ...r, rank: i + 1 }))
}
