/**
 * API endpoint integration tests using supertest.
 *
 * These tests boot the Express app in-process (no server.listen needed)
 * and assert real DB-backed responses. Requires `npm run prisma:seed`
 * to have populated the KB (ran during Fase 3).
 */
import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app.js'
import { prisma } from '../../src/lib/prisma.js'

const app = createApp()

// ─────────────────────────────────────────────────────────────────────
// GET /api/v1/health
// ─────────────────────────────────────────────────────────────────────

describe('GET /api/v1/health', () => {
  it('returns 200 with status ok and dbConnected:true', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      success: true,
      data: { status: 'ok', dbConnected: true },
    })
  })
})

// ─────────────────────────────────────────────────────────────────────
// GET /api/v1/symptoms
// ─────────────────────────────────────────────────────────────────────

describe('GET /api/v1/symptoms', () => {
  it('returns 24 symptoms', async () => {
    const res = await request(app).get('/api/v1/symptoms')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.symptoms).toHaveLength(24)
    expect(res.body.data.symptoms[0]).toMatchObject({
      code: 'G001',
      name: 'Batuk',
      category: 'umum',
    })
  })

  it('filters by category=telinga', async () => {
    const res = await request(app).get('/api/v1/symptoms?category=telinga')
    expect(res.status).toBe(200)
    expect(res.body.data.symptoms.length).toBeGreaterThan(0)
    res.body.data.symptoms.forEach((s: { category: string }) => {
      expect(s.category).toBe('telinga')
    })
  })

  it('rejects invalid category with 400', async () => {
    const res = await request(app).get('/api/v1/symptoms?category=invalid')
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('does NOT include internal fields (id, createdAt) in DTO', async () => {
    const res = await request(app).get('/api/v1/symptoms')
    const sample = res.body.data.symptoms[0]
    expect(sample).not.toHaveProperty('id')
    expect(sample).not.toHaveProperty('createdAt')
    expect(sample).not.toHaveProperty('isActive')
  })
})

// ─────────────────────────────────────────────────────────────────────
// GET /api/v1/diseases  +  GET /api/v1/diseases/:code
// ─────────────────────────────────────────────────────────────────────

describe('GET /api/v1/diseases', () => {
  it('returns 5 diseases with full payload', async () => {
    const res = await request(app).get('/api/v1/diseases')
    expect(res.status).toBe(200)
    expect(res.body.data.diseases).toHaveLength(5)
    const sample = res.body.data.diseases[0]
    expect(sample).toHaveProperty('causes')
    expect(sample).toHaveProperty('treatmentAdvice')
    expect(sample).toHaveProperty('whenToSeeDoctor')
  })
})

describe('GET /api/v1/diseases/:code', () => {
  it('returns Otitis Media Akut for code P001', async () => {
    const res = await request(app).get('/api/v1/diseases/P001')
    expect(res.status).toBe(200)
    expect(res.body.data.disease).toMatchObject({
      code: 'P001',
      name: 'Otitis Media Akut',
      icdCode: 'H66.0',
    })
  })

  it('returns 404 for non-existent code', async () => {
    const res = await request(app).get('/api/v1/diseases/P999')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('returns 400 for malformed code (validation)', async () => {
    const res = await request(app).get('/api/v1/diseases/INVALID')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})

// ─────────────────────────────────────────────────────────────────────
// GET /api/v1/cf-rules
// ─────────────────────────────────────────────────────────────────────

describe('GET /api/v1/cf-rules', () => {
  it('returns 34 rules', async () => {
    const res = await request(app).get('/api/v1/cf-rules')
    expect(res.status).toBe(200)
    expect(res.body.data.rules).toHaveLength(34)
  })

  it('filters by diseaseCode=P001 → 8 rules', async () => {
    const res = await request(app).get('/api/v1/cf-rules?diseaseCode=P001')
    expect(res.status).toBe(200)
    expect(res.body.data.rules).toHaveLength(8)
    res.body.data.rules.forEach((r: { diseaseCode: string }) => {
      expect(r.diseaseCode).toBe('P001')
    })
  })

  it('filters by symptomCode=G020 → 2 rules with weight 1.0', async () => {
    const res = await request(app).get('/api/v1/cf-rules?symptomCode=G020')
    expect(res.status).toBe(200)
    expect(res.body.data.rules).toHaveLength(2)
    res.body.data.rules.forEach((r: { expertWeight: number }) => {
      expect(r.expertWeight).toBe(1.0)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────
// POST /api/v1/diagnose — the main endpoint
// ─────────────────────────────────────────────────────────────────────

describe('POST /api/v1/diagnose', () => {
  it('returns top-3 diagnosis for valid input', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [
          { symptomCode: 'G020', userWeight: 0.8 },
          { symptomCode: 'G011', userWeight: 0.6 },
          { symptomCode: 'G023', userWeight: 0.4 },
        ],
      })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.results).toBeInstanceOf(Array)
    expect(res.body.data.results.length).toBeGreaterThan(0)
    expect(res.body.data.results.length).toBeLessThanOrEqual(3)
    expect(res.body.data.meta).toMatchObject({
      inputCount: 3,
      engineVersion: '1.0.0',
    })
    expect(res.body.data.meta.durationMs).toBeGreaterThanOrEqual(0)
  })

  it('top result for ear-pain heavy input is Otitis Media (P001) or Otitis Eksterna (P003)', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 1.0 }],
      })
    expect(res.status).toBe(200)
    const top = res.body.data.results[0]
    expect(['P001', 'P003']).toContain(top.diseaseCode)
    expect(top.cfValue).toBe(1.0)
    expect(top.confidenceLevel).toBe('very_high')
  })

  it('result includes contributingSymptoms + iterationSteps + explanation', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [
          { symptomCode: 'G020', userWeight: 0.8 },
          { symptomCode: 'G011', userWeight: 0.6 },
        ],
      })
    const top = res.body.data.results[0]
    expect(top.contributingSymptoms).toBeInstanceOf(Array)
    expect(top.iterationSteps).toBeInstanceOf(Array)
    expect(typeof top.explanation).toBe('string')
    expect(top.explanation).toContain('Sistem mendiagnosis')
  })

  it('rejects empty symptoms array (400 validation)', async () => {
    const res = await request(app).post('/api/v1/diagnose').send({ symptoms: [] })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects invalid userWeight (0.5 not in valid set)', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 0.5 }],
      })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects malformed symptomCode (400 validation)', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'BAD', userWeight: 0.6 }],
      })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects unknown symptomCode that passes regex but not in DB', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'G999', userWeight: 0.6 }],
      })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_INPUT')
  })

  it('persists session when persistSession=true and returns sessionToken', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 0.8 }],
        persistSession: true,
      })
    expect(res.status).toBe(200)
    expect(typeof res.body.data.sessionToken).toBe('string')
    expect(res.body.data.sessionToken.length).toBeGreaterThan(20) // cuid

    // Confirm row exists in DB
    const session = await prisma.consultationSession.findUnique({
      where: { sessionToken: res.body.data.sessionToken },
    })
    expect(session).not.toBeNull()
  })

  it('does NOT persist session by default', async () => {
    const res = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 0.8 }],
      })
    expect(res.status).toBe(200)
    expect(res.body.data.sessionToken).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────
// 404 fallback
// ─────────────────────────────────────────────────────────────────────

describe('404 fallback', () => {
  it('returns standardized 404 for unknown route', async () => {
    const res = await request(app).get('/api/v1/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'NOT_FOUND' },
    })
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})
