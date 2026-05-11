# Diagnova — Sistem Pakar Diagnosis THT

> *Setiap diagnosis, punya alasannya.*

Sistem pakar berbasis **Certainty Factor (MYCIN)** untuk pra-konsultasi
gangguan **Telinga, Hidung, dan Tenggorokan**. Setiap diagnosis dilengkapi
alasan, daftar aturan yang aktif, dan tingkat kepastian yang dapat
ditelusuri ke gejala asli. Bukan pengganti dokter — alat bantu transparan
untuk pasien dan tenaga medis non-spesialis.

**Status:** ✅ Sprint 1 selesai · 83/83 tests pass · Real CF engine running

---

## 📑 Daftar Isi

1. [Tentang Project](#1-tentang-project)
2. [Tech Stack](#2-tech-stack)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Quick Start](#4-quick-start)
5. [Panduan Setup Lengkap](#5-panduan-setup-lengkap)
6. [Struktur Folder](#6-struktur-folder)
7. [Cara Kerja Sistem](#7-cara-kerja-sistem)
8. [Workflow Pengembangan](#8-workflow-pengembangan)
9. [Testing](#9-testing)
10. [Dokumentasi Teknis](#10-dokumentasi-teknis)
11. [Troubleshooting](#11-troubleshooting)
12. [Roadmap](#12-roadmap)
13. [Kredit & Referensi](#13-kredit--referensi)

---

## 1. Tentang Project

Diagnova adalah implementasi modern dari sistem pakar Certainty Factor
untuk diagnosis pra-konsultasi penyakit THT. Berbasis penelitian:

> **Setyaputri, K.E., Fadlil, A., & Sunardi (2018).** *Analisis Metode
> Certainty Factor pada Sistem Pakar Diagnosa Penyakit THT.* Jurnal Teknik
> Elektro Vol. 10 No. 1, hal. 30–35. Universitas Ahmad Dahlan, Yogyakarta.

### Cakupan knowledge base

| Aspek | Jumlah |
|---|---|
| Kondisi (ICD-10) | **5** |
| Gejala terverifikasi | **24** |
| Aturan inferensi (bobot pakar) | **34** |

**5 kondisi yang tercakup:**

| Kode | Nama | ICD-10 | Kategori |
|---|---|---|---|
| P001 | Otitis Media Akut | H66.0 | Telinga |
| P002 | Serumen Obsturans | H61.2 | Telinga |
| P003 | Otitis Eksterna | H60.9 | Telinga |
| P004 | Sinusitis | J32.9 | Hidung |
| P005 | Rhinitis Kronis | J31.0 | Hidung |

Bobot pakar dikalibrasi oleh **dr. M. Agus Sugicharto, Sp.THT-KL** berdasarkan
rekam medis pasien (sumber: jurnal Setyaputri 2018).

### Untuk siapa sistem ini?

- **Pasien (18–45 tahun)** dengan keluhan THT yang ingin gambaran awal sebelum ke dokter
- **Orang tua** yang ingin memahami keluhan anak sebelum kunjungan klinik
- **Tenaga medis non-spesialis** untuk referensi cepat sebelum rujukan

### ⚠️ Disclaimer

Sistem ini memberikan **rekomendasi pra-konsultasi**, **BUKAN diagnosis
final**. Selalu konsultasi dengan dokter THT untuk diagnosis dan penanganan
resmi. Sistem ini tidak menggantikan pemeriksaan klinis, otoskopi, atau
prosedur diagnostik medis lainnya.

---

## 2. Tech Stack

### Frontend

| Komponen | Teknologi | Versi |
|---|---|---|
| Bundler | Vite | 5.4.x |
| UI framework | React | 18.3.x |
| Bahasa | TypeScript | 5.6.x |
| Styling | Tailwind CSS | 3.4.x |
| Animasi | Framer Motion | 11.x |
| Routing | React Router | 6.28.x |
| State | Zustand | 5.0.x |
| Icons | Lucide React | 0.468.x |

### Backend

| Komponen | Teknologi | Versi |
|---|---|---|
| Runtime | Node.js | ≥ 20.0 |
| Framework | Express | 4.21.x |
| Bahasa | TypeScript | 5.7.x |
| ORM | Prisma | 5.22.x |
| Database | PostgreSQL | 15+ (tested di 17) |
| Validation | Zod | 3.24.x |
| Test runner | Vitest | 2.1.x |
| HTTP test | supertest | 7.0.x |
| Security headers | helmet | 8.0.x |
| CORS | cors | 2.8.x |

---

## 3. Arsitektur Sistem

### Diagram high-level

```
┌────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                              │
│   (Chrome / Firefox / Safari → http://localhost:5173)              │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│              FRONTEND  (Vite dev server, port 5173)                │
│                                                                    │
│   React + TypeScript + Tailwind + Framer Motion                    │
│                                                                    │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  Pages:  /  /konsultasi  /hasil  /penyakit  /penyakit/:id   │  │
│   │  Store:  Zustand (selectedSymptoms, results)                │  │
│   │  API client:  src/lib/api.ts + diagnova-api.ts (typed)      │  │
│   └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │  fetch JSON
                                  │  (CORS: localhost:5173 → :3001)
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│              BACKEND  (Express, port 3001)                         │
│                                                                    │
│   Endpoints (REST, prefix /api/v1):                                │
│     • GET  /health                                                 │
│     • GET  /symptoms                                               │
│     • GET  /diseases  +  /diseases/:code                           │
│     • GET  /cf-rules                                               │
│     • POST /diagnose       ◄── core CF inference                   │
│     • POST /sessions  +  GET /sessions/:token                      │
│                                                                    │
│   Layered architecture:                                            │
│   ┌──────────────────────────────────────────────────────────┐     │
│   │  HTTP Layer    — routes + Zod validation                 │     │
│   │  Controller    — orchestrate validate → service → JSON   │     │
│   │  Service       — business logic (load KB + run engine)   │     │
│   │  Domain        — CF Engine (PURE function, 0 dependency) │     │
│   │  Repository    — Prisma data access                      │     │
│   └──────────────────────────────────────────────────────────┘     │
└─────────────────────────────────┬──────────────────────────────────┘
                                  │  Prisma
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│              POSTGRESQL  (port 5432)                               │
│                                                                    │
│   Database: diagnova                                               │
│     • symptoms        (24 rows)                                    │
│     • diseases        (5 rows)                                     │
│     • cf_rules        (34 rows)                                    │
│     • consultation_sessions (anonymous, token-based)               │
│     • consultation_results  (denormalized for analytics)           │
└────────────────────────────────────────────────────────────────────┘
```

### Layer dependency (Clean Architecture)

```
HTTP Layer
   ↓
Controller
   ↓
Service ───────► Repository ───► Prisma ───► PostgreSQL
   │
   ↓
Domain (Pure CF Engine — no dependency to upper layers)
```

**Aturan dependency:** arah panah selalu ke bawah. Domain layer **tidak
boleh** import dari HTTP/Controller/Service. Ini yang memungkinkan CF
Engine di-test tanpa setup DB.

### Data flow lengkap (use case: konsultasi)

```
1. User pilih 3+ gejala dengan tingkat keyakinan di /konsultasi
   └─► selectedSymptoms = Map<symptomCode, userWeight> tersimpan di Zustand

2. User klik "Mulai Diagnosis"
   └─► handleAnalyze() jalanin Promise.all([diagnose(...), wait(2.2s)])
       ├─ POST /api/v1/diagnose { symptoms: [...] }
       └─ ProcessingAnimation multi-stage tampil

3. Backend Express terima request
   ├─► Zod validate body (symptomCode pattern, userWeight enum)
   ├─► diagnosisService.diagnose() dipanggil
   ├─► Load knowledge base via repositories (symptoms, diseases, rules)
   ├─► runDiagnosis(symptoms, kb) — PURE function:
   │     a. Untuk tiap penyakit:
   │        - Match rules dengan input symptoms
   │        - cf_i = userWeight × expertWeight per rule
   │        - Sort cf descending
   │        - Iterative combine: cf₁ + cf₂×(1−cf₁) → cf_combined
   │        - Drop kalau cf_combined < 0.1
   │     b. Sort kandidat by cf desc, ambil top-3
   │     c. Assign rank 1..3, build contribution %, iteration trace,
   │        Indonesian explanation
   ├─► Optional: persist ke ConsultationSession kalau persistSession=true
   └─► Return JSON: { results, sessionToken?, meta }

4. Frontend terima response
   ├─► setResult(response.results) di Zustand store
   └─► navigate('/hasil')

5. ResultPage mount
   └─► Render: DiagnosisCard (primary + 2 secondary) +
       ExplainabilityPanel (iteration steps) +
       ContributionChart (gejala % contribution) +
       RegionHeatmap (visualisasi area)
```

---

## 4. Quick Start

> Asumsi: Anda sudah punya **Node 20+**, **PostgreSQL 15+**, dan **Git**
> terinstall. Kalau belum, lihat [Panduan Setup Lengkap](#5-panduan-setup-lengkap).

```bash
# 1. Clone repository
git clone <repository-url>
cd Sistem_Pakar_THT

# 2. Setup database (sekali saja saat clone pertama)
psql -U postgres -c "CREATE DATABASE diagnova;"

# 3. Install dan setup backend
cd backend
cp .env.example .env                     # sesuaikan kalau perlu
npm install
npm run prisma:migrate:deploy             # apply schema
npm run prisma:seed                       # isi knowledge base (24+5+34 rows)
cd ..

# 4. Install frontend
cd frontend
cp .env.example .env.local                # default sudah benar untuk dev
npm install
cd ..

# 5. Jalankan — perlu DUA terminal terpisah
# ─── Terminal 1 ──────────────────────────────
cd backend
npm run dev
# Output: 🚀 Diagnova API ready at http://localhost:3001/api/v1

# ─── Terminal 2 (terminal baru) ──────────────
cd frontend
npm run dev
# Output: ➜ Local: http://localhost:5173/

# 6. Buka browser → http://localhost:5173
```

Sistem siap dipakai. **Tidak ada mock data** — semua diagnosis dihitung
oleh CF engine asli yang query database PostgreSQL.

### Verifikasi cepat

```bash
# Backend health check
curl http://localhost:3001/api/v1/health
# Expected: {"success":true,"data":{"status":"ok","dbConnected":true},...}

# Test diagnosis real
curl -X POST http://localhost:3001/api/v1/diagnose \
  -H "Content-Type: application/json" \
  -d '{"symptoms":[{"symptomCode":"G020","userWeight":1.0}]}'
# Expected: 3 results dengan CF score asli
```

---

## 5. Panduan Setup Lengkap

Lihat **[docs/SETUP.md](docs/SETUP.md)** untuk panduan detail per OS
(Windows / macOS / Linux), termasuk:

- Install Node.js 20+ via package manager bawaan
- Install PostgreSQL 17 step-by-step
- Setup database user + permissions
- Edit environment variables
- Verifikasi setiap langkah
- Common troubleshooting

---

## 6. Struktur Folder

```
Sistem_Pakar_THT/
│
├── frontend/                    # Vite + React + TypeScript
│   ├── src/
│   │   ├── app/                 # App, Router, Providers
│   │   ├── pages/               # 7 routes (Landing, Konsultasi, dst)
│   │   ├── components/
│   │   │   ├── landing/         # Section hero, knowledge base, dll
│   │   │   ├── consultation/    # Region picker, symptom card, loading
│   │   │   ├── result/          # Diagnosis card, CF meter, chart
│   │   │   ├── shared/          # Navbar, Footer, PageShell
│   │   │   ├── visuals/         # Anatomy, sound wave, confidence ring
│   │   │   └── ui/              # Button, Card, Badge primitives
│   │   ├── lib/                 # api.ts, diagnova-api.ts, utils.ts
│   │   ├── data/                # Reference data (symptoms, diseases)
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript types
│   ├── public/                  # img-*.png, favicon
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── .env.local               # VITE_API_URL (gitignored)
│   ├── .env.example             # Template env
│   └── README.md
│
├── backend/                     # Express + Prisma + PostgreSQL
│   ├── src/
│   │   ├── domain/
│   │   │   └── cf/              # PURE CF engine (cfEngine.ts, cfExplainer.ts)
│   │   ├── services/            # Business logic orchestration
│   │   ├── repositories/        # Prisma data access
│   │   ├── http/
│   │   │   ├── routes/          # Route definitions
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── middleware/      # errorHandler, asyncHandler, dll
│   │   │   └── schemas/         # Zod validation schemas
│   │   ├── mappers/             # Prisma row → API DTO
│   │   ├── lib/                 # config, prisma, logger, errors
│   │   ├── app.ts               # Express factory
│   │   └── server.ts            # Entry point + graceful shutdown
│   ├── prisma/
│   │   ├── schema.prisma        # 6 tables (symptoms, diseases, rules, sessions, results)
│   │   ├── migrations/          # Auto-generated by prisma migrate
│   │   └── seed.ts              # 24+5+34 KB seeder (idempotent)
│   ├── tests/
│   │   ├── integration/         # api.test.ts, sessions.test.ts, repositories.test.ts
│   │   └── fixtures/            # knowledgeBase.ts (test data)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── .env                     # DATABASE_URL, PORT (gitignored)
│   ├── .env.example
│   └── README.md
│
├── docs/                        # Dokumentasi teknis
│   ├── PRD_THT_ExpertSystem_Modern.md
│   ├── jurnal_THT.pdf
│   ├── ARCHITECTURE.md          # Arsitektur sistem detail
│   ├── SETUP.md                 # Panduan setup lengkap per OS
│   └── backend/
│       ├── CF_ENGINE.md         # Algoritma CF + formula + edge cases
│       ├── SCHEMA.md            # ERD database + tabel detail
│       ├── API.md               # API contract semua endpoint
│       └── FRONTEND_INTEGRATION.md  # Integrasi frontend ↔ backend
│
├── .gitignore                   # Root-level (covers all workspaces)
└── README.md                    # File ini — pintu masuk project
```

**Prinsip struktur:**
- `frontend/` dan `backend/` adalah **workspace terpisah** — masing-masing
  punya `package.json`, `tsconfig.json`, `node_modules` sendiri
- Tidak pakai monorepo tooling (Turbo/Nx) — overhead tidak sesuai skala saat ini
- `docs/` di root karena dishare oleh kedua workspace
- Tidak ada root `package.json` — workflow dev pakai 2 terminal terpisah

---

## 7. Cara Kerja Sistem

### Formula Certainty Factor (MYCIN)

**Single-rule CF:**

```
cf_i = userWeight_i × expertWeight_i
```

- `userWeight ∈ {0.2, 0.4, 0.6, 0.8, 1.0}` — tingkat keyakinan user
- `expertWeight ∈ (0, 1]` — bobot pakar dari rule base

**Iterative combination:**

```
cf_combined = cf_1 + cf_2 × (1 − cf_1)
```

Dimulai dari CF tertinggi, dilanjutkan iteratif. **Komutatif** — urutan
tidak mempengaruhi nilai akhir, tapi kita sort descending untuk
iteration trace yang lebih clean.

**Confidence band:**

| Nilai CF | Level | Label |
|---|---|---|
| ≥ 0.8 | very_high | Sangat Tinggi |
| ≥ 0.6 | high | Tinggi |
| ≥ 0.4 | medium | Cukup |
| < 0.4 | low | Rendah |

Penyakit dengan `cf_combined < 0.1` di-drop dari hasil.

### Contoh perhitungan manual

**Skenario:** User pilih 3 gejala untuk dicocokkan ke P001 (Otitis Media Akut):

| Symptom | userWeight | expertWeight (P001) | cf_i |
|---|---|---|---|
| G020 (Telinga nyeri) | 0.8 | 1.0 | **0.80** |
| G011 (Pendengaran berkurang) | 0.6 | 0.6 | **0.36** |
| G023 (Telinga berdengung) | 0.4 | 0.6 | **0.24** |

**Iterative combination:**

```
iter 1: cf_combined = 0.80                                  (initial)
iter 2: 0.80 + 0.36 × (1 − 0.80) = 0.80 + 0.072    = 0.872
iter 3: 0.872 + 0.24 × (1 − 0.872) = 0.872 + 0.0307 = 0.9027
```

**Hasil akhir:**

```
cfValue = 0.9027
cfPercentage = "90.3%"
confidenceLevel = "very_high"
explanation = "Sistem mendiagnosis Otitis Media Akut dengan tingkat
              keyakinan sangat tinggi. Gejala paling berkontribusi:
              Telinga nyeri, Pendengaran berkurang, Telinga berdengung."
```

Detail lengkap algoritma + edge cases ada di
**[docs/backend/CF_ENGINE.md](docs/backend/CF_ENGINE.md)**.

---

## 8. Workflow Pengembangan

### 8.1 Menjalankan dev mode

```bash
# Terminal 1 — backend (auto-restart on file change via tsx watch)
cd backend
npm run dev

# Terminal 2 — frontend (Vite HMR)
cd frontend
npm run dev
```

### 8.2 Membuat perubahan kode

| Apa yang diubah | Folder | Tool yang reload otomatis |
|---|---|---|
| Frontend React component | `frontend/src/...` | Vite HMR (instant) |
| Backend logic | `backend/src/...` | tsx watch (restart server) |
| Database schema | `backend/prisma/schema.prisma` | Manual: `npm run prisma:migrate` |
| Knowledge base content | `backend/prisma/seed.ts` | Manual: `npm run prisma:seed` |

### 8.3 Sebelum commit

```bash
# Backend
cd backend
npx tsc --noEmit            # TypeScript check (0 errors)
npm test                     # 83/83 tests pass
npm run lint                 # ESLint (optional)

# Frontend
cd frontend
npx tsc --noEmit            # TypeScript check
npm run build                # Production build sukses
```

### 8.4 Update knowledge base

Knowledge base ada di `backend/prisma/seed.ts`. Setelah edit:

```bash
cd backend
npm run prisma:seed          # Idempotent — re-run apa pun
```

Seed pakai `upsert` jadi:
- Data baru → di-INSERT
- Data lama yang berubah → di-UPDATE
- Data lama yang sama → tidak ada perubahan

---

## 9. Testing

### Backend (83 tests)

```bash
cd backend
npm test                     # Run all once
npm run test:watch           # Watch mode
npm run test:coverage        # With coverage report
```

**Breakdown:**

| File | Test count | Cakupan |
|---|---|---|
| `cfEngine.test.ts` | 33 | Formula MYCIN + edge cases + journal validation |
| `cfExplainer.test.ts` | 7 | Indonesian explanation generation |
| `repositories.test.ts` | 13 | Disease/Symptom/Rule repository (real DB) |
| `api.test.ts` | 22 | All 5 public endpoints (supertest) |
| `sessions.test.ts` | 8 | Session save/load round-trip |
| **Total** | **83** | |

### Frontend (build verification)

```bash
cd frontend
npx tsc --noEmit            # TypeScript safety
npm run build                # Production bundle
```

> Frontend tidak punya unit test framework saat ini. Smoke test manual
> via browser setelah `npm run dev`.

---

## 10. Dokumentasi Teknis

Semua dokumentasi mendalam ada di folder `docs/`:

| Dokumen | Isi | Audience |
|---|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arsitektur sistem level deep, dependency graph, decision log | Backend / fullstack dev |
| [docs/SETUP.md](docs/SETUP.md) | Setup detail per OS + troubleshooting | Developer baru clone project |
| [docs/backend/CF_ENGINE.md](docs/backend/CF_ENGINE.md) | Algoritma CF, formula, contoh perhitungan, edge cases | Backend dev / akademisi |
| [docs/backend/SCHEMA.md](docs/backend/SCHEMA.md) | ERD + per-tabel detail + repository signatures | Backend / DB engineer |
| [docs/backend/API.md](docs/backend/API.md) | API contract semua endpoint + error codes + contoh curl | Frontend / integration dev |
| [docs/backend/FRONTEND_INTEGRATION.md](docs/backend/FRONTEND_INTEGRATION.md) | Bagaimana frontend talk ke backend | Frontend dev |

**Sumber referensi:**
- `docs/PRD_THT_ExpertSystem_Modern.md` — Product Requirements Document
- `docs/jurnal_THT.pdf` — Jurnal Setyaputri 2018 (source knowledge base)

---

## 11. Troubleshooting

### Backend tidak bisa start: `EADDRINUSE :3001`

Port 3001 sudah dipakai proses lain (mungkin backend dev session sebelumnya).

```bash
# Cek apa yang pakai port 3001
netstat -ano | grep ":3001 "

# Kill process node manual
taskkill //F //IM node.exe    # Windows
killall node                   # macOS / Linux
```

### Frontend tidak bisa connect: `Network error / CORS`

Pastikan **backend running dulu** sebelum frontend. Verify:

```bash
curl http://localhost:3001/api/v1/health
```

Kalau respons `Status: null` di browser tapi curl OK → kemungkinan
preflight cache. Hard refresh browser dengan `Ctrl+Shift+R` atau clear
cache `localhost`.

### Database connection failed: `dbConnected: false`

PostgreSQL service tidak running.

```bash
# Windows
net start postgresql-x64-17

# macOS (Homebrew)
brew services start postgresql@17

# Linux
sudo systemctl start postgresql
```

Kalau service running tapi credentials salah, cek `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diagnova?schema=public"
```

### Prisma error: `Migration drift detected`

Schema di-edit manual atau migration corrupt.

```bash
cd backend
npm run db:reset             # DESTRUCTIVE — drops + recreates DB
```

### Frontend stuck di loading: white screen di `/hasil`

Kemungkinan AnimatePresence + Routes wait mode bermasalah. Sudah difix di
sprint sebelumnya. Kalau muncul lagi, cek `frontend/src/app/Router.tsx`
— AnimatePresence harus pakai mode default (bukan `wait`).

### Saat seed gagal: `unique constraint violation`

Database punya data inkonsisten dari seed sebelumnya.

```bash
cd backend
npm run db:reset             # Bersihkan + re-seed
```

Lebih banyak troubleshooting di **[docs/SETUP.md](docs/SETUP.md)**.

---

## 12. Roadmap

### ✅ Sprint 1 (selesai)

- [x] Foundation backend Express + Prisma
- [x] CF Engine pure (40 unit tests sesuai jurnal)
- [x] Knowledge base 24+5+34 di PostgreSQL
- [x] 7 public REST endpoints (83 integration tests)
- [x] Frontend integrasi real API (mock dihapus)
- [x] Session persistence (anonymous, token-based)
- [x] Multi-stage UX loading
- [x] Dokumentasi komprehensif
- [x] Folder structure rapi (frontend/ + backend/ pisah)

### ⏳ Fase 7 (belum — production polish)

- [ ] Rate limiting `POST /diagnose` (express-rate-limit)
- [ ] Production logger (Pino structured JSON)
- [ ] Helmet config conditional (strict di production)
- [ ] HTTPS / SSL setup
- [ ] Backend production build script + start script
- [ ] Deployment guide (Vercel + Railway / Fly.io / VPS manual)
- [ ] Database backup strategy
- [ ] Monitoring (health check wire ke Sentry / Uptime)
- [ ] Tombol "Bagikan" UI wiring (endpoint sudah ready)

### 🔮 Sprint 2 (future)

- [ ] Admin panel — CRUD knowledge base
- [ ] Authentication (JWT) untuk admin
- [ ] Audit log perubahan rule base
- [ ] Multi-language (English explanation)
- [ ] Adaptive expert weights (dari user feedback)
- [ ] Tambah penyakit di luar 5 yang sudah ada
- [ ] Mobile app (React Native?)

---

## 13. Kredit & Referensi

### Knowledge base
- **Setyaputri, K.E., Fadlil, A., & Sunardi (2018).** *Analisis Metode
  Certainty Factor pada Sistem Pakar Diagnosa Penyakit THT.* Jurnal Teknik
  Elektro Vol. 10 No. 1, hal. 30–35. Universitas Ahmad Dahlan. E-ISSN 2549-1571.

### Clinical validation
- **dr. M. Agus Sugicharto, Sp.THT-KL** — validator klinis bobot pakar
  (Tabel III jurnal).

### Metodologi
- **Shortliffe, E.H., & Buchanan, B.G. (1975).** *A model of inexact reasoning
  in medicine.* Mathematical Biosciences 23(3-4): 351–379. (MYCIN original paper.)

### ICD-10 codes
- World Health Organization (WHO) ICD-10 — International Statistical
  Classification of Diseases and Related Health Problems, 10th Revision.

---

## Lisensi

Project ini dibangun untuk keperluan **akademik / penelitian**. Lihat file
LICENSE (atau hubungi maintainer) untuk informasi lisensi resmi.

---

<div align="center">

**Dibuat dengan ❤️ untuk transparansi diagnosis medis di Indonesia.**

[Backend README](backend/README.md) · [Frontend README](frontend/README.md) · [Dokumentasi Teknis](docs/)

</div>
