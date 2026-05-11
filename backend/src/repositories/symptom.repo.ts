/**
 * Symptom repository — DB access for the Symptom entity.
 *
 * Wraps Prisma calls so the rest of the app talks to typed methods, not
 * to Prisma directly. This keeps the ORM as a swappable detail.
 */
import type { Prisma, Symptom, SymptomCategory } from '@prisma/client'
import { prisma } from '@lib/prisma.js'

export interface SymptomRepository {
  findAll(filter?: { category?: SymptomCategory; activeOnly?: boolean }): Promise<Symptom[]>
  findByCode(code: string): Promise<Symptom | null>
  findManyByCodes(codes: string[]): Promise<Symptom[]>
  count(filter?: { activeOnly?: boolean }): Promise<number>
}

export const symptomRepo: SymptomRepository = {
  async findAll({ category, activeOnly = true } = {}) {
    const where: Prisma.SymptomWhereInput = {}
    if (activeOnly) where.isActive = true
    if (category) where.category = category

    return prisma.symptom.findMany({
      where,
      orderBy: { code: 'asc' },
    })
  },

  async findByCode(code) {
    return prisma.symptom.findUnique({ where: { code } })
  },

  async findManyByCodes(codes) {
    if (codes.length === 0) return []
    return prisma.symptom.findMany({
      where: { code: { in: codes }, isActive: true },
    })
  },

  async count({ activeOnly = true } = {}) {
    return prisma.symptom.count({
      where: activeOnly ? { isActive: true } : undefined,
    })
  },
}
