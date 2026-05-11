/**
 * Sessions endpoint integration tests.
 *
 * Verifies the full round-trip:
 *   1. Diagnose with persistSession → token returned
 *   2. GET /sessions/:token → input + results recovered
 * Plus standalone POST /sessions path.
 */
import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../../src/app.js'
import { prisma } from '../../src/lib/prisma.js'

const app = createApp()

describe('Session lifecycle (POST /diagnose with persistSession → GET /sessions/:token)', () => {
  it('persists & retrieves via persistSession=true', async () => {
    // Step 1: Run diagnosis with persist flag
    const diagnoseRes = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [
          { symptomCode: 'G020', userWeight: 0.8 },
          { symptomCode: 'G011', userWeight: 0.6 },
        ],
        persistSession: true,
      })
    expect(diagnoseRes.status).toBe(200)
    const token = diagnoseRes.body.data.sessionToken
    expect(typeof token).toBe('string')

    // Step 2: Fetch back
    const getRes = await request(app).get(`/api/v1/sessions/${token}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.success).toBe(true)
    expect(getRes.body.data.sessionToken).toBe(token)
    expect(getRes.body.data.symptoms).toEqual([
      { symptomCode: 'G020', userWeight: 0.8 },
      { symptomCode: 'G011', userWeight: 0.6 },
    ])
    expect(getRes.body.data.results.length).toBeGreaterThan(0)
    expect(getRes.body.data.results[0].diseaseCode).toBe(
      diagnoseRes.body.data.results[0].diseaseCode,
    )
    expect(typeof getRes.body.data.createdAt).toBe('string')
  })
})

describe('POST /api/v1/sessions (standalone save)', () => {
  it('saves a previously-computed result + returns token', async () => {
    // First, get a real engine result to save (avoids fabricating values)
    const diagnoseRes = await request(app)
      .post('/api/v1/diagnose')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 1.0 }],
      })
    expect(diagnoseRes.status).toBe(200)

    // Now save standalone
    const saveRes = await request(app)
      .post('/api/v1/sessions')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 1.0 }],
        results: diagnoseRes.body.data.results,
      })
    expect(saveRes.status).toBe(201)
    expect(saveRes.body.success).toBe(true)
    expect(typeof saveRes.body.data.sessionToken).toBe('string')
  })

  it('rejects empty symptoms', async () => {
    const res = await request(app).post('/api/v1/sessions').send({
      symptoms: [],
      results: [],
    })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects empty results', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 1.0 }],
        results: [],
      })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects malformed result shape', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .send({
        symptoms: [{ symptomCode: 'G020', userWeight: 1.0 }],
        results: [{ diseaseCode: 'P001' /* missing required fields */ }],
      })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})

describe('GET /api/v1/sessions/:token', () => {
  it('returns 404 for non-existent token', async () => {
    const res = await request(app).get(
      '/api/v1/sessions/clxxxxxxxxxxxxxxxxxxxxxxx',
    )
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('rejects malformed token (too short)', async () => {
    const res = await request(app).get('/api/v1/sessions/short')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects malformed token (non-alphanumeric chars)', async () => {
    const res = await request(app).get(
      '/api/v1/sessions/INVALID-TOKEN-with-dashes',
    )
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})

afterAll(async () => {
  await prisma.$disconnect()
})
