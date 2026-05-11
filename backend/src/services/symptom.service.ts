/**
 * Symptom service — orchestrates repository + mapper.
 *
 * Service layer is the only place where multiple repos may be coordinated
 * and DTOs are produced. Controllers/HTTP layer never touch repos directly.
 */
import { symptomRepo } from '@repositories/symptom.repo.js'
import { toSymptomDTO, type SymptomDTO } from '@mappers/symptom.mapper.js'
import type { SymptomCategory } from '@prisma/client'

export const symptomService = {
  async listAll(filter?: { category?: SymptomCategory }): Promise<SymptomDTO[]> {
    const rows = await symptomRepo.findAll({ category: filter?.category })
    return rows.map(toSymptomDTO)
  },
}
