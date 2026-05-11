/**
 * Repository integration tests.
 *
 * These tests hit a real PostgreSQL instance — make sure the database is
 * seeded (`npm run prisma:seed`) before running.
 *
 * Skipped automatically if DATABASE_URL is unavailable in CI.
 */
import { afterAll, describe, expect, it } from 'vitest'
import { prisma } from '../../src/lib/prisma.js'
import { symptomRepo } from '../../src/repositories/symptom.repo.js'
import { diseaseRepo } from '../../src/repositories/disease.repo.js'
import { ruleRepo } from '../../src/repositories/rule.repo.js'

describe('symptomRepo', () => {
  it('findAll returns 24 active symptoms', async () => {
    const all = await symptomRepo.findAll()
    expect(all.length).toBe(24)
    // Sorted by code asc
    expect(all[0]!.code).toBe('G001')
    expect(all[23]!.code).toBe('G024')
  })

  it('findByCode returns the matching symptom', async () => {
    const s = await symptomRepo.findByCode('G020')
    expect(s).not.toBeNull()
    expect(s!.name).toBe('Telinga nyeri')
  })

  it('findByCode returns null for unknown code', async () => {
    expect(await symptomRepo.findByCode('G999')).toBeNull()
  })

  it('findManyByCodes returns the requested subset', async () => {
    const list = await symptomRepo.findManyByCodes(['G020', 'G011', 'G018'])
    expect(list.length).toBe(3)
    const codes = list.map((s) => s.code).sort()
    expect(codes).toEqual(['G011', 'G018', 'G020'])
  })

  it('findAll filters by category', async () => {
    const ear = await symptomRepo.findAll({ category: 'telinga' })
    expect(ear.length).toBeGreaterThan(0)
    ear.forEach((s) => expect(s.category).toBe('telinga'))
  })

  it('count returns 24', async () => {
    expect(await symptomRepo.count()).toBe(24)
  })
})

describe('diseaseRepo', () => {
  it('findAll returns 5 active diseases', async () => {
    const all = await diseaseRepo.findAll()
    expect(all.length).toBe(5)
    expect(all.map((d) => d.code)).toEqual(['P001', 'P002', 'P003', 'P004', 'P005'])
  })

  it('findByCode P001 returns Otitis Media Akut', async () => {
    const d = await diseaseRepo.findByCode('P001')
    expect(d).not.toBeNull()
    expect(d!.name).toBe('Otitis Media Akut')
    expect(d!.icdCode).toBe('H66.0')
    expect(d!.causes.length).toBe(4)
    expect(d!.relatedDiseases).toEqual(['P003', 'P002'])
  })

  it('findByCode returns null for unknown code', async () => {
    expect(await diseaseRepo.findByCode('P999')).toBeNull()
  })
})

describe('ruleRepo', () => {
  it('findAll returns 34 active rules', async () => {
    const all = await ruleRepo.findAll()
    expect(all.length).toBe(34)
  })

  it('findByDiseaseCode P001 returns 8 rules', async () => {
    const rules = await ruleRepo.findByDiseaseCode('P001')
    expect(rules.length).toBe(8)
    rules.forEach((r) => expect(r.diseaseCode).toBe('P001'))
  })

  it('findByDiseaseCode P002 returns 4 rules (Serumen)', async () => {
    const rules = await ruleRepo.findByDiseaseCode('P002')
    expect(rules.length).toBe(4)
  })

  it('G020 (pathognomonic) appears in 2 disease rules with weight 1.0', async () => {
    const rules = await ruleRepo.findBySymptomCode('G020')
    expect(rules.length).toBe(2)
    rules.forEach((r) => expect(r.expertWeight).toBe(1.0))
    const codes = rules.map((r) => r.diseaseCode).sort()
    expect(codes).toEqual(['P001', 'P003'])
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})
