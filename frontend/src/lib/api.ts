/**
 * Diagnova API client — typed fetch wrapper.
 *
 * Centralizes base URL resolution, JSON parsing, and standardized error
 * handling. Every API call goes through this module so the rest of the app
 * doesn't need to know about HTTP details.
 *
 * Base URL is read from `VITE_API_URL` (set in .env.local for dev, in the
 * deployment platform for prod). Defaults to localhost:3001 if unset.
 */

/** Discriminated union matching backend's standardized response shape. */
export type ApiResponse<T> =
  | { success: true; data: T; message: string }
  | {
      success: false
      error: { code: string; message: string; details?: unknown }
    }

/** Thrown when the backend returns a non-2xx response or success=false. */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/** Base URL — points at backend's /api/v1 prefix. */
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ??
  'http://localhost:3001/api/v1'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  /** Query string params (auto-serialized + URL-encoded) */
  query?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, query?: FetchOptions['query']): string {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, query } = opts

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    // Network / CORS / abort
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(
      'NETWORK_ERROR',
      err instanceof Error ? err.message : 'Network request failed',
      0,
    )
  }

  let payload: ApiResponse<T>
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    throw new ApiError(
      'INVALID_RESPONSE',
      `Server returned non-JSON response (${response.status})`,
      response.status,
    )
  }

  if (!response.ok || !payload.success) {
    const err = !payload.success ? payload.error : null
    throw new ApiError(
      err?.code ?? 'HTTP_ERROR',
      err?.message ?? `HTTP ${response.status}`,
      response.status,
      err?.details,
    )
  }

  return payload.data
}

export const apiClient = {
  get: <T>(path: string, opts?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'POST', body }),
}

/** Expose base URL for debugging / health check UI. */
export const apiBaseUrl = BASE_URL
