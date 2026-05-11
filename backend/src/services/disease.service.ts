/**
 * Disease service.
 */
import { diseaseRepo } from '@repositories/disease.repo.js'
import { toDiseaseDTO, type DiseaseDTO } from '@mappers/disease.mapper.js'
import { ApiError } from '@lib/errors.js'

export const diseaseService = {
  async listAll(): Promise<DiseaseDTO[]> {
    const rows = await diseaseRepo.findAll()
    return rows.map(toDiseaseDTO)
  },

  async getByCode(code: string): Promise<DiseaseDTO> {
    const row = await diseaseRepo.findByCode(code)
    if (!row || !row.isActive) {
      throw ApiError.notFound(`Disease ${code} not found`)
    }
    return toDiseaseDTO(row)
  },
}
