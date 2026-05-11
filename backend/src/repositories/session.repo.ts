/**
 * Consultation Session repository.
 *
 * Persists anonymous consultation sessions and their top-3 results so users
 * can share their diagnosis via a token-bearing URL.
 */
import type { ConsultationSession, Prisma } from '@prisma/client'
import { prisma } from '@lib/prisma.js'

export interface CreateSessionInput {
  inputSymptoms: Prisma.InputJsonValue
  rawResults: Prisma.InputJsonValue
  durationMs?: number
  ipHash?: string
  userAgent?: string
  topResults: Array<{
    diseaseId: string
    cfValue: number
    rank: number
  }>
}

export interface SessionRepository {
  create(input: CreateSessionInput): Promise<ConsultationSession>
  findByToken(token: string): Promise<ConsultationSession | null>
}

export const sessionRepo: SessionRepository = {
  async create(input) {
    return prisma.consultationSession.create({
      data: {
        inputSymptoms: input.inputSymptoms,
        rawResults: input.rawResults,
        durationMs: input.durationMs ?? null,
        ipHash: input.ipHash ?? null,
        userAgent: input.userAgent ?? null,
        results: {
          create: input.topResults.map((r) => ({
            diseaseId: r.diseaseId,
            cfValue: r.cfValue,
            rank: r.rank,
          })),
        },
      },
    })
  },

  async findByToken(token) {
    return prisma.consultationSession.findUnique({
      where: { sessionToken: token },
    })
  },
}
