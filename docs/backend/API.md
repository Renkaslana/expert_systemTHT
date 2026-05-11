# API Reference — Diagnova Backend

> Public REST API untuk konsumsi frontend Diagnova. Semua endpoint berbasis
> JSON, tidak butuh authentication, response shape terstandarisasi.

**Status:** ✅ Implemented · 75/75 tests pass · Engine v1.0.0
**Base URL:** `http://localhost:3001/api/v1` (dev) · production TBD
**Content-Type:** `application/json`

---

## 1. Format response standardized

Setiap response mengikuti pola:

```typescript
// Success
{ success: true, data: <T>, message: string }

// Error
{ success: false, error: { code: string, message: string, details?: any } }
```

### Error codes

| Code | HTTP | Kapan terjadi |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod schema validation failure |
| `INVALID_INPUT` | 400 | Logic-level invalid (mis. unknown symptom code) |
| `NOT_FOUND` | 404 | Resource tidak ada (disease P999, route salah) |
| `CONFLICT` | 409 | Resource conflict |
| `UNAUTHORIZED` | 401 | (reserved untuk admin di Sprint 2) |
| `RATE_LIMITED` | 429 | (reserved — diaktifkan di Fase 7) |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled error (server bug) |

---

## 2. Endpoint reference

### 2.1 `GET /api/v1/health`

**Tujuan:** Health probe untuk monitoring & deployment.

**Request:** —

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 123,
    "dbConnected": true,
    "timestamp": "2026-05-10T15:07:17.367Z"
  },
  "message": "Service healthy"
}
```

**Response 503:** kalau DB tidak reachable, `status: "degraded"`, `dbConnected: false`.

---

### 2.2 `GET /api/v1/symptoms`

**Tujuan:** List 24 gejala THT untuk halaman konsultasi.

**Request:**
- Query param `category` (opsional): `telinga` | `hidung` | `tenggorokan` | `umum`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "symptoms": [
      {
        "code": "G001",
        "name": "Batuk",
        "nameEn": "Cough",
        "category": "umum",
        "bodyArea": "general",
        "severity": "low",
        "description": "Refleks tubuh untuk mengeluarkan iritan dari saluran pernapasan."
      }
      // ...23 more
    ]
  },
  "message": "OK"
}
```

**Errors:**
- `400 VALIDATION_ERROR` jika `category` bukan enum yang valid

**Contoh:**
```bash
curl http://localhost:3001/api/v1/symptoms
curl http://localhost:3001/api/v1/symptoms?category=telinga   # → 9 items
```

---

### 2.3 `GET /api/v1/diseases`

**Tujuan:** List 5 kondisi ENT (full payload) untuk knowledge base UI.

**Request:** —

**Response 200:**
```json
{
  "success": true,
  "data": {
    "diseases": [
      {
        "code": "P001",
        "name": "Otitis Media Akut",
        "nameShort": "OMA",
        "category": "Penyakit Telinga",
        "severity": "moderate",
        "icdCode": "H66.0",
        "iconKey": "ear",
        "description": "Otitis Media Akut adalah peradangan...",
        "causes": ["Infeksi bakteri...", "Komplikasi...", "...", "..."],
        "generalSymptoms": ["Nyeri telinga...", "..."],
        "treatmentAdvice": ["Istirahat cukup...", "..."],
        "whenToSeeDoctor": "Segera ke dokter jika nyeri sangat hebat...",
        "relatedDiseases": ["P003", "P002"],
        "expertSource": "dr. M. Agus Sugicharto, Sp.THT-KL"
      }
      // ...4 more
    ]
  },
  "message": "OK"
}
```

---

### 2.4 `GET /api/v1/diseases/:code`

**Tujuan:** Detail penyakit untuk halaman `DiseaseDetailPage`.

**Request:**
- Path param `code`: harus match `^P\d{3}$` (P001..P005)

**Response 200:** sama seperti satu entri dari `/diseases` di atas, di-wrap `data: { disease: ... }`.

**Errors:**
- `400 VALIDATION_ERROR` jika code malformed (mis. `INVALID`)
- `404 NOT_FOUND` jika code valid tapi tidak ada (mis. `P999`)

**Contoh:**
```bash
curl http://localhost:3001/api/v1/diseases/P001
```

---

### 2.5 `GET /api/v1/cf-rules`

**Tujuan:** Knowledge base raw rules untuk halaman Methodology / debug.

**Request:**
- Query `diseaseCode` (opsional): filter rule by penyakit
- Query `symptomCode` (opsional): filter rule by gejala

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rules": [
      { "diseaseCode": "P001", "symptomCode": "G001", "expertWeight": 0.8 },
      { "diseaseCode": "P001", "symptomCode": "G004", "expertWeight": 0.8 }
      // ...up to 34 rules
    ]
  },
  "message": "OK"
}
```

**Contoh:**
```bash
curl http://localhost:3001/api/v1/cf-rules                       # 34 rules
curl http://localhost:3001/api/v1/cf-rules?diseaseCode=P001       # 8 rules
curl http://localhost:3001/api/v1/cf-rules?symptomCode=G020       # 2 rules
```

---

### 2.6 `POST /api/v1/diagnose` ⭐ — Endpoint utama

**Tujuan:** Jalankan CF inference dan kembalikan top-3 hipotesis penyakit.

**Request body:**
```typescript
{
  symptoms: Array<{
    symptomCode: string,    // "G001".."G024"
    userWeight: number      // strict enum: 0.2 | 0.4 | 0.6 | 0.8 | 1.0
  }>,
  persistSession?: boolean  // default false — kalau true, simpan & return token
}
```

**Validation rules:**
- `symptoms.length`: 1..24
- `symptomCode`: match regex `^G\d{3}$` AND exists di KB
- `userWeight`: harus salah satu dari `[0.2, 0.4, 0.6, 0.8, 1.0]`
- Tidak boleh ada `symptomCode` duplikat

**Response 200:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "diseaseCode": "P003",
        "diseaseName": "Otitis Eksterna",
        "diseaseCategory": "Penyakit Telinga",
        "cfValue": 0.921,
        "cfPercentage": "92.1%",
        "confidenceLevel": "very_high",
        "rank": 1,
        "contributingSymptoms": [
          {
            "symptomCode": "G020",
            "symptomName": "Telinga nyeri",
            "userWeight": 0.8,
            "expertWeight": 1,
            "cfValue": 0.8,
            "contributionPercent": 52.6
          }
        ],
        "iterationSteps": [
          {
            "iteration": 1,
            "symptomCode": "G011",
            "symptomName": "Pendengaran berkurang",
            "cfBefore": 0.8,
            "cfAdded": 0.48,
            "cfAfter": 0.896,
            "formula": "0.800 + 0.480 × (1 − 0.800) = 0.896"
          }
        ],
        "explanation": "Sistem mendiagnosis Otitis Eksterna dengan tingkat keyakinan sangat tinggi. Gejala paling berkontribusi: Telinga nyeri, Pendengaran berkurang, Telinga berdengung."
      }
      // ...up to 3 results
    ],
    "sessionToken": "clx3a9b2k0001xyz...",  // hanya jika persistSession=true
    "meta": {
      "inputCount": 3,
      "durationMs": 45,
      "engineVersion": "1.0.0"
    }
  },
  "message": "OK"
}
```

**Edge case responses:**
- Empty array results (semua di bawah `cf >= 0.1`) → `data.results: []` — **bukan error**
- Untuk shape lengkap setiap field, lihat `backend/src/domain/cf/types.ts`

**Errors:**
- `400 VALIDATION_ERROR` — empty array, malformed code, weight di luar enum
- `400 INVALID_INPUT` — code valid format tapi tidak ada di KB (mis. G999)

**Contoh:**
```bash
curl -X POST http://localhost:3001/api/v1/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": [
      {"symptomCode": "G020", "userWeight": 0.8},
      {"symptomCode": "G011", "userWeight": 0.6},
      {"symptomCode": "G023", "userWeight": 0.4}
    ]
  }'
```

**Dengan persist session (untuk fitur share):**
```bash
curl -X POST http://localhost:3001/api/v1/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": [{"symptomCode": "G020", "userWeight": 1.0}],
    "persistSession": true
  }'
# Response includes sessionToken
```

**Detail algoritma:** lihat [`docs/backend/CF_ENGINE.md`](./CF_ENGINE.md)

---

### 2.7 `POST /api/v1/sessions` — Save session (standalone)

**Tujuan:** Simpan hasil diagnosis yang sudah dihitung supaya bisa di-share via URL.
Cocok untuk pattern "user lihat hasil dulu, baru klik Bagikan" — tidak perlu re-run engine.

**Request body:**
```typescript
{
  symptoms: SymptomInput[],     // 1..24 items, same as /diagnose input
  results: CFEngineResult[]     // 1..3 items, presumably from earlier /diagnose call
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "sessionToken": "clx3a9b2k0001xyz..." },
  "message": "Session saved"
}
```

**Errors:**
- `400 VALIDATION_ERROR` — empty arrays atau result shape salah
- `400 INVALID_INPUT` — semua `diseaseCode` di results tidak ada di KB

**Contoh:**
```bash
# 1) Hitung hasil dulu
curl -X POST http://localhost:3001/api/v1/diagnose \
  -H "Content-Type: application/json" \
  -d '{"symptoms":[{"symptomCode":"G020","userWeight":0.8}]}' > result.json

# 2) Save (asumsikan ada tooling untuk merge ke shape POST /sessions)
curl -X POST http://localhost:3001/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms":[{"symptomCode":"G020","userWeight":0.8}],
    "results":[ ...salin dari result.json data.results ]
  }'
```

**Catatan:** untuk simplifikasi UX, frontend biasanya pakai `POST /diagnose` dengan
`persistSession: true` yang melakukan compute + persist dalam satu round-trip.

---

### 2.8 `GET /api/v1/sessions/:token` — Load saved session

**Tujuan:** Ambil kembali sesi yang sudah disimpan untuk render ulang halaman hasil.
Token bersifat **secret-by-obscurity** — siapa yang punya URL bisa lihat sesi.

**Request:**
- Path param `token`: alphanumeric lowercase, panjang 20–40 char (format cuid)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "sessionToken": "clx3a9b2k0001xyz...",
    "symptoms": [
      { "symptomCode": "G020", "userWeight": 0.8 }
    ],
    "results": [
      {
        "diseaseCode": "P003",
        "diseaseName": "Otitis Eksterna",
        "cfValue": 1.0,
        "cfPercentage": "100.0%",
        "confidenceLevel": "very_high",
        "rank": 1,
        "contributingSymptoms": [ /* ... */ ],
        "iterationSteps": [ /* ... */ ],
        "explanation": "Sistem mendiagnosis..."
      }
    ],
    "durationMs": 45,
    "createdAt": "2026-05-10T22:37:07.123Z"
  },
  "message": "OK"
}
```

**Errors:**
- `400 VALIDATION_ERROR` — format token salah (terlalu pendek, ada karakter non-alphanumeric)
- `404 NOT_FOUND` — token format valid tapi tidak ada di DB

**Contoh:**
```bash
curl http://localhost:3001/api/v1/sessions/clx3a9b2k0001xyzabcd
```

**Use case di frontend:**
- URL share: `https://diagnova.app/hasil?session=clx3a9b2k0001xyzabcd`
- ResultPage detect query param → fetch session → render hasil tanpa re-input gejala

---

## 3. Architecture summary

```
HTTP Layer (Express)
   ↓
Controllers — Zod validate, format response
   ↓
Services — orchestrate, error mapping
   ↓
Domain (CF Engine — pure)  ←   Repositories (Prisma)
                                    ↓
                              PostgreSQL
```

Setiap layer punya tanggung jawab terpisah:
- **HTTP layer** — req/res shape, validation
- **Service** — business orchestration (load KB → run engine → optionally persist)
- **Domain** — pure CF logic (testable tanpa DB)
- **Repository** — Prisma data access (return domain-friendly DTOs)

---

## 4. Testing

### 4.1 Test counts

| Test file | Tests |
|---|---|
| `cfEngine.test.ts` | 33 |
| `cfExplainer.test.ts` | 7 |
| `repositories.test.ts` | 13 |
| `api.test.ts` | 22 |
| `sessions.test.ts` | 8 |
| **Total** | **83** |

### 4.2 Run

```bash
cd backend
npm test                    # all tests once
npm run test:watch          # watch mode
npm run test:coverage       # with coverage
```

### 4.3 API endpoint coverage

`tests/integration/api.test.ts` mencakup setiap endpoint:
- ✓ Happy path (200 dengan shape benar)
- ✓ Validation error (400 untuk input invalid)
- ✓ Not found (404 untuk resource hilang)
- ✓ Empty input handling
- ✓ Persist session round-trip
- ✓ Internal fields stripped dari DTO (id, isActive, timestamps)

---

## 5. Quick test (live curl)

Pastikan server jalan:
```bash
cd backend && npm run dev   # default port 3001
```

Kemudian dari terminal lain:

```bash
# 1) Health check
curl http://localhost:3001/api/v1/health

# 2) List symptoms
curl http://localhost:3001/api/v1/symptoms | head -c 200

# 3) Detail penyakit
curl http://localhost:3001/api/v1/diseases/P001 | head -c 300

# 4) Run diagnosis (REAL CF Engine — bukan mock!)
curl -X POST http://localhost:3001/api/v1/diagnose \
  -H "Content-Type: application/json" \
  -d '{"symptoms":[{"symptomCode":"G020","userWeight":0.8},{"symptomCode":"G011","userWeight":0.6},{"symptomCode":"G023","userWeight":0.4}]}'
```

**Expected diagnose output (verified):**
- Rank 1: P003 Otitis Eksterna · CF 92.1% · very_high
- Rank 2: P001 Otitis Media Akut · CF 90.3% · very_high
- Rank 3: P002 Serumen · CF 48.0% · medium

---

## 6. CORS

Backend hanya menerima request dari origin yang ada di `CORS_ORIGIN` env var
(default `http://localhost:5173` — frontend Vite dev server).

Kalau frontend production di-deploy ke domain lain, update env var:
```
CORS_ORIGIN=https://diagnova.app,http://localhost:5173
```

---

## 7. Rate limiting

> **Status:** Direncanakan di Fase 7. Saat ini tidak ada rate limit.

Plan: 30 req / 5 min per IP untuk `POST /diagnose`, no limit untuk GET.

---

## 8. Versioning

API path-based versioning: `/api/v1/...`

Breaking changes akan dirilis di `/api/v2/...`, v1 tetap tersedia minimal
6 bulan untuk migration.

`engineVersion` di response `/diagnose` (saat ini `"1.0.0"`) bisa berubah
independen dari API version — misalnya update bobot pakar tanpa breaking change.

---

## 9. Roadmap

| Status | Endpoint |
|---|---|
| ✅ Done | GET `/health` |
| ✅ Done | GET `/symptoms` (+ category filter) |
| ✅ Done | GET `/diseases` |
| ✅ Done | GET `/diseases/:code` |
| ✅ Done | GET `/cf-rules` (+ filters) |
| ✅ Done | POST `/diagnose` (+ persistSession) |
| ✅ Done | POST `/sessions` (standalone save) |
| ✅ Done | GET `/sessions/:token` |
| ⏭ Fase 7 | Rate limiting middleware |
| ⏭ Sprint 2 | Admin endpoints + JWT auth |

---

**File terkait:**
- `backend/src/http/routes/*` — route definitions
- `backend/src/http/controllers/*` — request handlers
- `backend/src/http/schemas/*` — Zod validation schemas
- `backend/src/services/*` — business logic orchestration
- `backend/src/mappers/*` — Prisma row → API DTO
- `backend/tests/integration/api.test.ts` — endpoint integration tests
