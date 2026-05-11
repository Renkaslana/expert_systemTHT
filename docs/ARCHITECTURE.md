# Arsitektur Sistem — Diagnova

> Dokumen arsitektur mendalam. Untuk overview cepat, lihat [README utama](../README.md).

**Audience:** developer yang akan mengembangkan / memodifikasi sistem,
dan akademisi yang ingin memahami pilihan teknis.

---

## 1. Filosofi arsitektur

Diagnova didesain dengan 4 prinsip:

| Prinsip | Konsekuensi praktis |
|---|---|
| **Transparansi** | Setiap diagnosis dapat ditelusuri ke gejala asli + bobot pakar. Bukan black box. |
| **Pure domain** | CF Engine adalah pure function — testable tanpa DB, swappable backend |
| **Anonymous-first** | Tidak ada akun, tidak ada PII. Session token = soft auth |
| **Faithful to source** | Knowledge base 1:1 dengan jurnal Setyaputri 2018, tervalidasi pakar |

---

## 2. Topology — 3-tier separation

```
┌─────────────────────────────────────────────────────────────────────┐
│   TIER 1: PRESENTATION                                              │
│   ─────────────────────                                             │
│   Vite + React + TypeScript     ← frontend/                         │
│   Tailwind + Framer Motion                                          │
│   Zustand (client state)                                            │
│   Port: 5173 (dev)                                                  │
└────────────────────────┬────────────────────────────────────────────┘
                         │  HTTPS / JSON / fetch
                         │  CORS-protected
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│   TIER 2: APPLICATION (API + Business Logic)                        │
│   ─────────────────────────────────────────                         │
│   Node.js 20 + Express + TypeScript    ← backend/                   │
│   Zod (validation)                                                  │
│   Pure CF Engine (domain)                                           │
│   Port: 3001 (dev)                                                  │
└────────────────────────┬────────────────────────────────────────────┘
                         │  Prisma client (SQL queries)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│   TIER 3: DATA                                                      │
│   ────────────                                                      │
│   PostgreSQL 15+                                                    │
│   Database: diagnova                                                │
│   Port: 5432                                                        │
└─────────────────────────────────────────────────────────────────────┘
```

**Keuntungan separation:**
- Frontend bisa di-deploy ke CDN (Vercel/Netlify), backend ke VPS/Container
- Frontend & backend bisa scale independen
- Mobile app bisa pakai backend yang sama tanpa modifikasi
- Database migration tidak menyentuh frontend code

---

## 3. Backend — Layered Architecture (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HTTP LAYER                            (backend/src/http/)          │
│  ├─ routes/         routes definitions per resource                 │
│  ├─ controllers/    request handlers — Zod validate, format JSON    │
│  ├─ middleware/     errorHandler, asyncHandler, notFound, logger    │
│  └─ schemas/        Zod schemas (common, diagnose, sessions)        │
│                                                                     │
│  Responsibility:                                                    │
│    • Parse HTTP request                                             │
│    • Validate input via Zod                                         │
│    • Call service                                                   │
│    • Format response → standardized JSON                            │
│    • Handle errors → standardized error JSON                        │
└────────────────────────────┬────────────────────────────────────────┘
                             │ method call (no HTTP knowledge)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SERVICE LAYER                         (backend/src/services/)      │
│  ├─ diagnosis.service.ts    orchestrate CF engine + KB + persist    │
│  ├─ disease.service.ts      list + detail diseases                  │
│  ├─ symptom.service.ts      list symptoms                           │
│  ├─ rule.service.ts         list/filter CF rules                    │
│  └─ session.service.ts      save + load consultations               │
│                                                                     │
│  Responsibility:                                                    │
│    • Business logic orchestration                                   │
│    • Coordinate multiple repositories                               │
│    • Call domain (pure CF engine) with KB data                      │
│    • Throw typed ApiError yang map ke HTTP status                   │
└────────────┬────────────────────────────┬───────────────────────────┘
             │                            │
             │ pure function call         │ method call
             ▼                            ▼
┌────────────────────────────┐ ┌─────────────────────────────────────┐
│  DOMAIN LAYER              │ │  REPOSITORY LAYER                   │
│  (backend/src/domain/cf/)  │ │  (backend/src/repositories/)        │
│  ├─ cfEngine.ts            │ │  ├─ disease.repo.ts                 │
│  ├─ cfExplainer.ts         │ │  ├─ symptom.repo.ts                 │
│  └─ types.ts               │ │  ├─ rule.repo.ts                    │
│                            │ │  └─ session.repo.ts                 │
│  Pure functions:           │ │                                     │
│    • combineCF             │ │  Responsibility:                    │
│    • computeSingleCF       │ │    • Prisma queries                 │
│    • runDiagnosis          │ │    • Map ORM rows → domain shape    │
│    • buildExplanation      │ │    • Hide ORM details from services │
│                            │ │                                     │
│  ZERO DB / HTTP dependency │ └────────────────┬────────────────────┘
│  ZERO import dari upper    │                  │ Prisma client
└────────────────────────────┘                  ▼
                              ┌─────────────────────────────────────┐
                              │  PERSISTENCE                         │
                              │  PostgreSQL via Prisma               │
                              │  (backend/prisma/schema.prisma)      │
                              └─────────────────────────────────────┘
```

### Aturan dependency

Arah panah selalu **TOP → BOTTOM**:

```
HTTP  →  Service  →  Repository  →  Prisma  →  PostgreSQL
            ↓
         Domain (pure, isolated)
```

**Domain layer (CF Engine) tidak boleh import dari upper layers.**
Konsekuensi: kita bisa unit test CF engine dengan KB fixture in-memory,
tanpa setup DB sama sekali.

```typescript
// ✅ BENAR: Service load KB, lalu pass ke pure function
const kb = await loadKnowledgeBase()   // service responsibility
const results = runDiagnosis(input, kb) // pure, no DB

// ❌ SALAH: Domain langsung query DB
function runDiagnosis(input) {
  const rules = prisma.cFRule.findMany(...)  // 🚫 nope
}
```

---

## 4. Frontend — Component Hierarchy

```
App.tsx
└─ Providers (Theme, etc)
   └─ BrowserRouter
      └─ ScrollToTop (resets scroll on route change)
      └─ Navbar
      └─ Routes
         ├─ /                  → LandingPage
         │  └─ Sections: Hero, HowItWorks, LiveDemo,
         │                ExplainableAI, KnowledgeBase, CTA
         ├─ /konsultasi        → ConsultationPage
         │  ├─ RegionPicker (telinga/hidung/tenggorokan/umum)
         │  ├─ SymptomCard (per gejala)
         │  ├─ AIAssistantPanel (sidebar with summary)
         │  └─ ProcessingAnimation (overlay when diagnosing)
         ├─ /hasil             → ResultPage
         │  ├─ RegionHeatmap
         │  ├─ DiagnosisCard (primary + 2 secondary)
         │  ├─ ExplainabilityPanel (iteration steps)
         │  └─ ContributionChart
         ├─ /penyakit          → DiseaseListPage (fetch /diseases)
         ├─ /penyakit/:id      → DiseaseDetailPage (fetch /diseases/:code)
         └─ /tentang           → AboutPage
      └─ Footer
```

### State management

```
┌────────────────────────────────────────────────────┐
│  Zustand stores (frontend/src/stores/)              │
│  ├─ consultationStore                              │
│  │   • selectedSymptoms: Map<code, weight>         │
│  │   • activeFilter: AreaFilter                    │
│  │   • result: DiagnosisResult[] | null            │
│  │   • startedAt: Date | null                      │
│  └─ themeStore                                     │
│      • theme: 'light' | 'dark' (persisted)         │
└────────────────────────────────────────────────────┘
```

State **client-only** (tidak persist ke localStorage kecuali theme). Result
dari API disimpan di-memory di Zustand untuk akses cepat oleh ResultPage.

### API client

```
fetch()
   ↓
frontend/src/lib/api.ts          ← generic wrapper:
                                    • base URL resolution
                                    • error normalization (ApiError class)
                                    • AbortController support
                                    • JSON parsing
   ↓
frontend/src/lib/diagnova-api.ts  ← typed endpoint functions:
                                    • getSymptoms()
                                    • getDiseases() / getDiseaseByCode()
                                    • diagnose()
                                    • createSession() / getSession()
   ↓
React components
```

Component **TIDAK pernah** panggil `fetch()` langsung — selalu via
`diagnova-api.ts`. Konsekuensi: type-safety end-to-end + mudah swap
implementasi (mock, SWR, React Query, dll).

---

## 5. Data Flow — Konsultasi end-to-end

Skenario: user pilih 3 gejala → klik "Mulai Diagnosis" → lihat hasil.

```
┌─ FRONTEND ──────────────────────────────────────────────────────────┐
│                                                                     │
│  ConsultationPage                                                   │
│     │                                                               │
│     │ user pilih gejala (3 symptoms with weights)                   │
│     ▼                                                               │
│  consultationStore.setSymptomWeight(code, weight)                   │
│     │                                                               │
│     │ user klik "Mulai Diagnosis"                                   │
│     ▼                                                               │
│  handleAnalyze() async:                                             │
│     ├─ setProcessing(true) → ProcessingAnimation tampil             │
│     ├─ Promise.all([                                                │
│     │    diagnose({ symptoms: payload }),                           │
│     │    wait(MIN_PROCESSING_MS)        ← UX padding 2.2s           │
│     │  ])                                                           │
│     │                                                               │
│     │ ── HTTP layer ──                                              │
│     │                                                               │
│     │  POST /api/v1/diagnose                                        │
│     │  Body: { symptoms: [{symptomCode, userWeight}, ...] }         │
│     └────────────────────────────────────────────────────────────┐  │
│                                                                  │  │
└──────────────────────────────────────────────────────────────────┼──┘
                                                                   ▼
┌─ BACKEND ────────────────────────────────────────────────────────────┐
│                                                                      │
│  Express router → diagnoseController                                 │
│     │                                                                │
│     ├─ Zod validate body (DiagnoseRequestSchema)                     │
│     │    • symptoms.length 1..24                                     │
│     │    • symptomCode regex /^G\d{3}$/                              │
│     │    • userWeight enum [0.2,0.4,0.6,0.8,1.0]                     │
│     │                                                                │
│     │  Throw ZodError if invalid → errorHandler → 400 VALIDATION_ERR │
│     │                                                                │
│     ▼                                                                │
│  diagnosisService.diagnose(input)                                    │
│     │                                                                │
│     ├─ loadKnowledgeBase()  ──→ repositories.findAll()               │
│     │    ├─ symptomRepo.findAll()    (24 rows)                       │
│     │    ├─ diseaseRepo.findAll()    (5 rows)                        │
│     │    └─ ruleRepo.findAll()       (34 rows, JOIN diseases+symptoms)│
│     │                                                                │
│     ├─ runDiagnosis(symptoms, kb)  ──→ PURE FUNCTION                 │
│     │    1. validateInputs (throw CFEngineError if unknown code)     │
│     │    2. For each disease in KB:                                  │
│     │       a. Match rules dengan input symptoms                     │
│     │       b. cf_i = userWeight × expertWeight (rounded 4dp)        │
│     │       c. Sort cf descending                                    │
│     │       d. Iterative combine:                                    │
│     │          cf_combined = cf₁ + cf₂×(1−cf₁) →                     │
│     │       e. Drop kalau cf_combined < CF_MIN_THRESHOLD (0.1)       │
│     │    3. Sort candidates by cf desc, ambil top-3, assign rank     │
│     │    4. Build contributionPercent + iterationSteps               │
│     │    5. buildExplanation() → Indonesian sentence                 │
│     │                                                                │
│     ├─ Optional: kalau persistSession=true:                          │
│     │    sessionRepo.create() → save ke ConsultationSession          │
│     │    Return sessionToken (cuid)                                  │
│     │                                                                │
│     └─ Return { results, sessionToken?, meta }                       │
│                                                                      │
│  Express response: 200 JSON                                          │
│  { success: true, data: { results, meta }, message: "OK" }           │
└────────────────────────────────────────────────────────────────────┬─┘
                                                                     │
┌─ FRONTEND ──────────────────────────────────────────────────────────┼─┐
│                                                                     ▼ │
│  handleAnalyze (cont.):                                               │
│     ├─ apiClient strip success/data wrapper → response.results        │
│     ├─ consultationStore.setResult(response.results)                  │
│     ├─ navigate('/hasil')                                             │
│     └─ setProcessing(false) → ProcessingAnimation exit                │
│                                                                       │
│  ResultPage mount:                                                    │
│     ├─ Read result + selectedSymptoms dari store                      │
│     ├─ If result empty → redirect ke /konsultasi                      │
│     └─ Render:                                                        │
│         ├─ DiagnosisCard (primary) — CF meter, contribution chart    │
│         ├─ DiagnosisCard (2 secondary) — compact format              │
│         ├─ ExplainabilityPanel — iterationSteps formula              │
│         └─ RegionHeatmap — visualisasi area tubuh                    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 6. Decision Log — Pilihan teknis & alasannya

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Backend framework | Express + TypeScript | Battle-tested, ekosistem matang, deploy fleksibel. Bukan Next.js karena frontend pakai Vite (tidak ada keuntungan integrasi). |
| Runtime | Node.js 20 | LTS terbaru, native fetch, top-level await, stable AbortController |
| ORM | Prisma 5 | Type-safe end-to-end, migration tooling matang, schema sebagai source of truth |
| Database | PostgreSQL 15+ | Free, mature, native array types untuk causes/treatmentAdvice, JSONB untuk session results |
| Validation | Zod | TypeScript-first, schema = types (DRY), composable, error messages bagus |
| Test runner | Vitest | Native ESM, cepat, syntax mirip Jest, integrasi sempurna dengan Vite |
| HTTP test | supertest | De-facto standard, integrate dengan Express app tanpa server real |
| Domain pattern | Clean Architecture (pure domain) | CF Engine = pure function. Test tanpa DB. Swap impl tanpa break domain. |
| State management (frontend) | Zustand | Tidak butuh Provider, Map/Set as state, minimal boilerplate vs Redux/Recoil |
| Animation | Framer Motion | Declarative, exit animations, layout animations, gesture support |
| Validation language | Zod (TS) | Single source untuk runtime validation + TS types |
| Project structure | frontend/ + backend/ pisah | Workspace independent, deploy independent, mental model jelas |
| Monorepo tooling | TIDAK pakai (Turbo/Nx) | Overhead tidak sesuai skala. Re-evaluate kalau >3 services. |
| CORS strategy | Explicit origin whitelist | Tidak `*` — security best practice |
| Session strategy | Anonymous + cuid token | Tidak butuh akun. Token bersifat secret-by-obscurity (untuk share URL). |
| Loading UX | Multi-stage 2.2s minimum | Medical context butuh "thinking time" yang terasa kredibel. Spinner < 100ms terasa glitchy. |
| Frontend reference data | Bundled `symptoms.ts` + `diseases.ts` | Performa landing page (instant render). Backend tetap canonical untuk diagnosis. |

---

## 7. Security model

### Threat model (Sprint 1 scope)

| Threat | Mitigation |
|---|---|
| **SQL injection** | Prisma parameterized queries — tidak ada raw SQL dengan user input |
| **XSS** | React auto-escape JSX. No `dangerouslySetInnerHTML`. |
| **CSRF** | Stateless API, no cookies. JSON body only (no form-urlencoded). |
| **Open CORS** | Explicit `CORS_ORIGIN` whitelist (default localhost:5173) |
| **Header injection** | helmet middleware (mostly default + CORP cross-origin) |
| **Resource exhaustion** | (Belum) Rate limiting di Fase 7 |
| **Data leakage via session token** | Token = cuid (25 char unguessable). Tidak ada PII di session. |
| **PII / privacy** | Tidak collect data identitas. IP di-hash SHA256 (16 char) untuk analytics, bukan plaintext. |
| **MIME confusion** | helmet's `X-Content-Type-Options: nosniff` aktif |
| **Clickjacking** | helmet's `X-Frame-Options: SAMEORIGIN` aktif |

### Threats NOT in Sprint 1 scope (Fase 7+)

- DDoS protection — butuh CDN / WAF layer
- HSTS — butuh HTTPS deployed first
- Rate limiting — Fase 7
- Sentry / alerting — Fase 7

---

## 8. Performance characteristics

### Latency (local dev, M-tier laptop)

| Endpoint | p50 | p99 |
|---|---|---|
| GET /health | 30ms | 80ms |
| GET /symptoms | 25ms | 60ms |
| GET /diseases | 40ms | 100ms |
| POST /diagnose (3 symptoms) | 50ms | 120ms |
| POST /diagnose (24 symptoms full) | 80ms | 180ms |

### CF engine itself

- 1 symptom: ~1ms
- 10 symptoms: ~3ms
- 24 symptoms full: ~5ms

99% latency = Prisma query + JSON serialization, bukan compute.

### Frontend bundle

- CSS: 17.36 KB gzipped
- JS: 156.91 KB gzipped
- Total per page load: < 200 KB (fast bahkan di 3G)

### Database

- Schema size: 6 tables, ~ 5KB structure
- Data size after seed: 24+5+34 rows ≈ 50KB
- Setiap sesi (kalau persist): ~2KB JSON

Scaling proyeksi (asumsi 1000 sesi/hari):
- DB growth: ~60MB/bulan
- Bandwidth: ~5MB/hari
- Tidak butuh sharding / replication sampai 100k+ sesi/hari

---

## 9. Database schema overview

```
┌──────────────────┐         ┌──────────────────┐
│    Symptom       │         │     Disease      │
│  (24 rows)       │         │   (5 rows)       │
└────────┬─────────┘         └────────┬─────────┘
         │  1                          │  1
         └────────┐         ┌──────────┘
                  │         │
                  │ N       │ N
                  ▼         ▼
              ┌────────────────┐
              │     CFRule     │
              │   (34 rows)    │
              │ UNIQUE(d,s)    │
              └────────────────┘

┌───────────────────────────┐
│ ConsultationSession       │
│ (anonymous, no FK to user)│
└──────────┬────────────────┘
           │  1
           │
           │  N
           ▼
┌───────────────────────────┐    ┌──────────────┐
│ ConsultationResult        │───►│  Disease     │
│ (denormalized top-3)      │    │  (existing)  │
└───────────────────────────┘    └──────────────┘
```

Detail lengkap di **[backend/SCHEMA.md](backend/SCHEMA.md)**.

---

## 10. Testing strategy

### Test pyramid

```
              ▲
            ◆◆◆      End-to-end (manual, browser)
           ◆◆◆◆◆
          ◆◆◆◆◆◆     Integration (22 + 8 + 13 tests)
         ◆◆◆◆◆◆◆◆◆
       ◆◆◆◆◆◆◆◆◆◆◆   Unit (33 + 7 tests, pure functions)
       ───────────
```

### Cakupan saat ini (83 tests)

- **40 unit tests** (CF engine + explainer) — 100% pure, no DB
- **13 integration tests** (repositories) — hit real DB
- **22 + 8 integration tests** (API endpoints + sessions) — full stack via supertest

Frontend tidak punya unit test framework. Smoke test manual via browser.

### Filosofi

- **CF engine validity** = jurnal Tabel V cases ter-cover, formula benar — checked di unit
- **DB integrity** = counts, foreign keys, repositories — checked di integration
- **API contract** = request/response shape match frontend expectation — checked di api.test.ts
- **End-to-end flow** = user journey lengkap — manual browser test (Fase 7 mungkin tambah Playwright)

---

## 11. Deployment topology (rencana)

> **Sprint 1: belum di-deploy.** Section ini adalah rencana untuk Fase 7.

```
┌─────────────────┐
│   Vercel /      │  ← Frontend static build
│   Netlify       │     (frontend/dist/)
└─────────┬───────┘
          │
          │  HTTPS
          ▼
┌─────────────────┐
│   Railway /     │  ← Backend (Express)
│   Fly.io        │     Node 20 runtime
└─────────┬───────┘
          │
          │  Internal network
          ▼
┌─────────────────┐
│   Neon /        │  ← Managed PostgreSQL
│   Supabase /    │     Connection pooling
│   Railway PG    │     Daily backups
└─────────────────┘
```

Alternative: VPS manual (Hetzner/DO) dengan nginx reverse proxy + PM2.

---

## 12. Diagrams sumber

Diagrams di atas dibuat dengan ASCII art untuk portability (tampil di
GitHub, terminal, PDF). Versi yang lebih kaya (Mermaid, draw.io) bisa
ditambah di iterasi berikutnya.

---

## 13. Bacaan lanjutan

- **[README utama](../README.md)** — overview project
- **[docs/SETUP.md](SETUP.md)** — panduan setup detail
- **[docs/backend/CF_ENGINE.md](backend/CF_ENGINE.md)** — algoritma CF deep dive
- **[docs/backend/SCHEMA.md](backend/SCHEMA.md)** — database schema
- **[docs/backend/API.md](backend/API.md)** — API reference
- **[docs/backend/FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** — frontend ↔ backend wire-up
