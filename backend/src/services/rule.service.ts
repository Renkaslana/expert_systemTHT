/**
 * CF Rule service.
 */
import { ruleRepo, type RuleRow } from '@repositories/rule.repo.js'

export const ruleService = {
  async listAll(filter?: {
    diseaseCode?: string
    symptomCode?: string
  }): Promise<RuleRow[]> {
    if (filter?.diseaseCode) return ruleRepo.findByDiseaseCode(filter.diseaseCode)
    if (filter?.symptomCode) return ruleRepo.findBySymptomCode(filter.symptomCode)
    return ruleRepo.findAll()
  },
}
