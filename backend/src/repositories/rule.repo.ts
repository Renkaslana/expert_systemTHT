/**
 * CF Rule repository.
 *
 * Returns rules in the engine-friendly shape: { diseaseCode, symptomCode,
 * expertWeight }. This involves a join with Symptom + Disease tables to
 * resolve internal IDs to public codes.
 */
import { prisma } from '@lib/prisma.js'

export interface RuleRow {
  diseaseCode: string
  symptomCode: string
  expertWeight: number
}

export interface RuleRepository {
  findAll(opts?: { activeOnly?: boolean }): Promise<RuleRow[]>
  findByDiseaseCode(diseaseCode: string): Promise<RuleRow[]>
  findBySymptomCode(symptomCode: string): Promise<RuleRow[]>
  count(opts?: { activeOnly?: boolean }): Promise<number>
}

export const ruleRepo: RuleRepository = {
  async findAll({ activeOnly = true } = {}) {
    const rows = await prisma.cFRule.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: {
        disease: { select: { code: true } },
        symptom: { select: { code: true } },
      },
    })
    return rows.map((r) => ({
      diseaseCode: r.disease.code,
      symptomCode: r.symptom.code,
      expertWeight: r.expertWeight,
    }))
  },

  async findByDiseaseCode(diseaseCode) {
    const rows = await prisma.cFRule.findMany({
      where: { isActive: true, disease: { code: diseaseCode } },
      include: {
        disease: { select: { code: true } },
        symptom: { select: { code: true } },
      },
    })
    return rows.map((r) => ({
      diseaseCode: r.disease.code,
      symptomCode: r.symptom.code,
      expertWeight: r.expertWeight,
    }))
  },

  async findBySymptomCode(symptomCode) {
    const rows = await prisma.cFRule.findMany({
      where: { isActive: true, symptom: { code: symptomCode } },
      include: {
        disease: { select: { code: true } },
        symptom: { select: { code: true } },
      },
    })
    return rows.map((r) => ({
      diseaseCode: r.disease.code,
      symptomCode: r.symptom.code,
      expertWeight: r.expertWeight,
    }))
  },

  async count({ activeOnly = true } = {}) {
    return prisma.cFRule.count({
      where: activeOnly ? { isActive: true } : undefined,
    })
  },
}
