/**
 * Typed API surface for Diagnova endpoints.
 *
 * Each function is a thin wrapper around apiClient with the exact frontend
 * type signatures. Components import from here, not from `api.ts` directly.
 *
 * Returned shapes are the SAME TypeScript interfaces already used across the
 * frontend (`Symptom`, `Disease`, `DiagnosisResult` from `@/types`). The
 * backend's API contract is intentionally aligned with these types so we
 * don't need a separate DTO layer on the client.
 */
import { apiClient } from './api'
import type {
  Disease,
  Symptom,
  DiagnosisResult,
  CFRule,
} from '@/types'

// ─── Symptoms ───────────────────────────────────────────────────────

export async function getSymptoms(opts?: {
  category?: 'telinga' | 'hidung' | 'tenggorokan' | 'umum'
  signal?: AbortSignal
}): Promise<Symptom[]> {
  const data = await apiClient.get<{ symptoms: Symptom[] }>('/symptoms', {
    query: { category: opts?.category },
    signal: opts?.signal,
  })
  return data.symptoms
}

// ─── Diseases ───────────────────────────────────────────────────────

export async function getDiseases(opts?: { signal?: AbortSignal }): Promise<Disease[]> {
  const data = await apiClient.get<{ diseases: Disease[] }>('/diseases', {
    signal: opts?.signal,
  })
  return data.diseases
}

export async function getDiseaseByCode(
  code: string,
  opts?: { signal?: AbortSignal },
): Promise<Disease> {
  const data = await apiClient.get<{ disease: Disease }>(
    `/diseases/${encodeURIComponent(code)}`,
    { signal: opts?.signal },
  )
  return data.disease
}

// ─── CF rules ───────────────────────────────────────────────────────

export async function getCfRules(opts?: {
  diseaseCode?: string
  symptomCode?: string
  signal?: AbortSignal
}): Promise<CFRule[]> {
  const data = await apiClient.get<{ rules: CFRule[] }>('/cf-rules', {
    query: {
      diseaseCode: opts?.diseaseCode,
      symptomCode: opts?.symptomCode,
    },
    signal: opts?.signal,
  })
  return data.rules
}

// ─── Diagnose (core flow) ───────────────────────────────────────────

export interface DiagnoseRequest {
  symptoms: Array<{ symptomCode: string; userWeight: number }>
  persistSession?: boolean
}

export interface DiagnoseResponse {
  results: DiagnosisResult[]
  sessionToken?: string
  meta: {
    inputCount: number
    durationMs: number
    engineVersion: string
  }
}

export async function diagnose(
  request: DiagnoseRequest,
  opts?: { signal?: AbortSignal },
): Promise<DiagnoseResponse> {
  return apiClient.post<DiagnoseResponse>('/diagnose', request, {
    signal: opts?.signal,
  })
}

/** Convenience: convert Map<code, weight> (what consultationStore uses) → API payload. */
export function symptomMapToDiagnoseInput(
  selected: Map<string, number>,
): DiagnoseRequest['symptoms'] {
  return Array.from(selected.entries())
    .filter(([, weight]) => weight > 0)
    .map(([symptomCode, userWeight]) => ({ symptomCode, userWeight }))
}

// ─── Sessions ───────────────────────────────────────────────────────

export interface SessionPayload {
  sessionToken: string
  symptoms: Array<{ symptomCode: string; userWeight: number }>
  results: DiagnosisResult[]
  durationMs: number | null
  createdAt: string
}

export async function getSession(
  token: string,
  opts?: { signal?: AbortSignal },
): Promise<SessionPayload> {
  return apiClient.get<SessionPayload>(`/sessions/${encodeURIComponent(token)}`, {
    signal: opts?.signal,
  })
}

export async function createSession(
  payload: {
    symptoms: Array<{ symptomCode: string; userWeight: number }>
    results: DiagnosisResult[]
  },
): Promise<{ sessionToken: string }> {
  return apiClient.post<{ sessionToken: string }>('/sessions', payload)
}
