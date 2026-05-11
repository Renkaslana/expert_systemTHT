/**
 * Disease repository.
 */
import type { Disease } from '@prisma/client'
import { prisma } from '@lib/prisma.js'

export interface DiseaseRepository {
  findAll(opts?: { activeOnly?: boolean }): Promise<Disease[]>
  findByCode(code: string): Promise<Disease | null>
  count(opts?: { activeOnly?: boolean }): Promise<number>
}

export const diseaseRepo: DiseaseRepository = {
  async findAll({ activeOnly = true } = {}) {
    return prisma.disease.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { code: 'asc' },
    })
  },

  async findByCode(code) {
    return prisma.disease.findUnique({ where: { code } })
  },

  async count({ activeOnly = true } = {}) {
    return prisma.disease.count({
      where: activeOnly ? { isActive: true } : undefined,
    })
  },
}
