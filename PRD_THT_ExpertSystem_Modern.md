# 🧠 ClaraTHT — Explainable AI Assisted Expert System
## Product Requirements Document (PRD) · v2.0

> **Basis Ilmiah:** Setyaputri, K.E., Fadlil, A., & Sunardi. (2018). *Analisis Metode Certainty Factor pada Sistem Pakar Diagnosa Penyakit THT.* Jurnal Teknik Elektro Vol. 10 No. 1, hal. 30–35.
>
> **Pendekatan:** Explainable AI Assisted Expert System
> **Stack:** React 18 + Next.js 14 (API) + PostgreSQL + Prisma
> **Target:** Production-Ready · Portfolio-Quality · Startup-Grade

---

## Daftar Isi

1. [Product Vision](#1-product-vision)
2. [System Concept](#2-system-concept)
3. [User Flow](#3-user-flow)
4. [Feature List](#4-feature-list)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Knowledge Base Design](#7-knowledge-base-design)
8. [Certainty Factor Engine](#8-certainty-factor-engine)
9. [Database Design](#9-database-design)
10. [UI/UX Design Direction](#10-uiux-design-direction)
11. [Pages Structure](#11-pages-structure)
12. [AI Agent Development Plan](#12-ai-agent-development-plan)
13. [Recommended Tech Stack](#13-recommended-tech-stack)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Future Scalability](#15-future-scalability)

---

## 1. Product Vision

### 1.1 Tagline

> **"Understand your symptoms before your appointment."**

### 1.2 Tujuan Aplikasi

ClaraTHT adalah platform diagnosis pre-konsultasi penyakit THT (Telinga, Hidung, Tenggorokan) berbasis web yang menggunakan **Explainable AI** — pengguna tidak hanya mendapat hasil diagnosis, tapi juga **memahami mengapa** sistem sampai pada kesimpulan tersebut.

Tidak seperti chatbot kesehatan generik, ClaraTHT:
- Menggunakan basis pengetahuan dari **dokter spesialis THT nyata**
- Menampilkan **transparansi penuh** proses inferensi (explainability)
- Memberikan **visualisasi confidence** yang intuitif
- Dirancang **tidak terlihat seperti sistem skripsi** — terasa seperti produk healthtech profesional

### 1.3 Target User

| Segmen | Deskripsi | Pain Point |
|--------|-----------|------------|
| **Primary User** | Masyarakat umum 18–45 tahun dengan keluhan THT | Tidak tahu harus ke dokter mana, ingin informasi cepat |
| **Secondary User** | Orang tua dengan anak yang sakit THT | Butuh panduan awal sebelum ke klinik |
| **Tertiary User** | Tenaga medis non-spesialis (perawat, bidan desa) | Butuh referensi cepat untuk rujukan |
| **Admin** | Pengelola sistem / peneliti | Kelola knowledge base, lihat analytics |

### 1.4 Masalah yang Diselesaikan

```
BEFORE ClaraTHT                    AFTER ClaraTHT
─────────────────                  ──────────────────
❌ Googling gejala → hoaks         ✅ Diagnosis berbasis pakar tervalidasi
❌ Tidak tahu gejala apa yang       ✅ Guided consultation flow yang terstruktur
   relevan
❌ Hasil "mungkin A atau B"         ✅ Confidence score + penjelasan detail
   tanpa penjelasan
❌ Takut ke dokter tanpa info       ✅ Siap ke dokter dengan pemahaman kondisi
❌ Informasi tersebar               ✅ Satu platform, terstruktur, terpercaya
```

### 1.5 Value Proposition

- **Explainable** — setiap diagnosis dilengkapi breakdown "kenapa sistem menyimpulkan ini"
- **Trustworthy** — berbasis jurnal ilmiah tervalidasi, bukan rule-of-thumb
- **Beautiful** — UI sekelas aplikasi healthtech modern, bukan form HTML biasa
- **Fast** — dari buka halaman ke hasil diagnosis < 3 menit
- **Transparent** — semua bobot dan rule bisa dilihat publik (open knowledge base)

---

## 2. System Concept

### 2.1 Konsep Sistem Pakar

ClaraTHT mengadopsi arsitektur **Expert System** klasik yang dimodernisasi:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLARA THT SYSTEM                         │
│                                                             │
│  ┌───────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │  User Interface│    │  Inference   │    │  Knowledge  │  │
│  │  (React)       │◄──►│  Engine (CF) │◄──►│  Base (DB)  │  │
│  └───────────────┘    └──────────────┘    └─────────────┘  │
│         │                    │                    │         │
│         ▼                    ▼                    ▼         │
│  ┌───────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │  Consultation │    │  Explanation │    │  Expert     │  │
│  │  Session      │    │  Generator   │    │  Knowledge  │  │
│  └───────────────┘    └──────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Bagaimana Certainty Factor Digunakan

Certainty Factor (CF) adalah metode yang diadopsi dari sistem medis MYCIN (1970s) untuk menangani **ketidakpastian** dalam diagnosis. Dalam ClaraTHT:

**Level 1 — User menyatakan keyakinannya terhadap setiap gejala:**
```
Tidak dipilih → 0     (gejala tidak relevan)
Ragu-ragu    → 0.2   (sedikit merasakan)
Mungkin      → 0.4   (cukup merasakan)
Sangat Mungkin → 0.6 (jelas merasakan)
Hampir Pasti → 0.8   (sangat jelas)
Pasti        → 1.0   (100% yakin)
```

**Level 2 — Pakar memberikan bobot untuk setiap gejala per penyakit:**
```
Bobot pakar: 0.2 – 1.0
Semakin tinggi = gejala semakin diagnostik untuk penyakit tersebut
```

**Level 3 — CF Engine menggabungkan keduanya:**
```
CF per gejala = user_weight × expert_weight

Kombinasi iteratif:
CF_combined = CF1 + CF2 × (1 - CF1)
               ↑ diulang untuk semua gejala yang dipilih
```

### 2.3 Bagaimana Knowledge Base Bekerja

```
Knowledge Base Structure:
─────────────────────────
Symptoms (24 gejala)
    └── setiap gejala punya: kode, nama, kategori, deskripsi detail

Diseases (5 penyakit)
    └── setiap penyakit punya: kode, nama, deskripsi, penyebab,
        gejala umum, saran penanganan, tingkat keparahan

CF Rules (mapping many-to-many)
    └── Disease ↔ Symptom ↔ ExpertWeight
    └── Example: P004(Sinusitis) ↔ G014(Sakit kepala) = 1.0
                 artinya: sakit kepala sangat diagnostik untuk sinusitis
```

### 2.4 Alur Inferensi (Inference Flow)

```
Input: [G001=0.6, G014=0.6, G013=0.6, G005=0.8]
         ↓
For each disease in KB:
  1. Find matching symptoms (user input ∩ disease rules)
  2. Calculate CF per symptom: user_weight × expert_weight
  3. Sort CF values (optional, order doesn't affect result)
  4. Combine iteratively:
     cf_combined[0] = cf_values[0]
     cf_combined[i] = cf_combined[i-1] + cf_values[i] × (1 - cf_combined[i-1])
  5. Store final CF for disease
         ↓
Sort diseases by CF descending
Filter: CF ≥ 0.1
Return top 3
         ↓
Output: [
  { disease: "Sinusitis", cf: 0.917, rank: 1 },
  { disease: "Rhinitis Kronis", cf: 0.890, rank: 2 }
]
```

---

## 3. User Flow

### 3.1 Main Consultation Flow

```
┌─────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│ Landing │───▶│ Body Map /   │───▶│ Symptom         │───▶│ Processing   │
│  Page   │    │ Quick Start  │    │ Selection Form  │    │ Animation    │
└─────────┘    └──────────────┘    └─────────────────┘    └──────┬───────┘
                                                                  │
                                                                  ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│  History &      │◀───│  Disease Detail  │◀───│   Diagnosis Result      │
│  Save Session   │    │  Page            │    │   (CF Visualization +   │
└─────────────────┘    └──────────────────┘    │    Explanation)         │
                                               └─────────────────────────┘
```

**Detail setiap langkah:**

**Step 1: Landing Page**
- Hero section dengan animasi visual THT
- Tombol "Mulai Konsultasi" yang menonjol
- Brief explanation tentang sistem
- Disclaimer medis yang terlihat profesional (bukan popup annoying)

**Step 2: Onboarding / Quick Filter**
- User memilih area keluhan: Telinga / Hidung / Tenggorokan / Semua
- Visual interactive body diagram (opsional, UX enhancement)
- Sistem memprioritaskan tampilan gejala sesuai area

**Step 3: Symptom Selection**
- Card-based symptom selection (bukan form biasa)
- 5-level slider atau radio button per gejala
- Real-time counter gejala yang dipilih
- Grouped by: Telinga | Hidung | Tenggorokan | Umum
- Tombol info (?) untuk setiap gejala (penjelasan medis singkat)

**Step 4: Processing**
- Animated loading screen (terasa seperti "AI sedang berpikir")
- Durasi: 1.5–2 detik (deliberate delay untuk UX)
- Visual: particle animation atau brain/scan animation

**Step 5: Diagnosis Result**
- Primary diagnosis dengan confidence meter animasi
- Secondary candidates di bawah
- **Explainability section**: breakdown gejala mana yang berkontribusi
- Chart: contribution per gejala (bar chart)
- Tombol: Lihat Detail | Simpan | Mulai Ulang | Cetak

**Step 6: Disease Detail**
- Informasi lengkap penyakit
- Gejala umum, penyebab, saran penanganan
- Link ke "Cari Dokter THT Terdekat" (Google Maps embed)
- Related conditions

### 3.2 Admin Flow

```
Login → Dashboard Overview
          ├── Knowledge Base Management
          │     ├── Symptoms (CRUD)
          │     ├── Diseases (CRUD + rich text)
          │     └── CF Rules (visual matrix editor)
          ├── Consultation Analytics
          │     ├── Total diagnoses trend
          │     ├── Top diagnosed diseases
          │     ├── Symptom frequency heatmap
          │     └── User session stats
          └── System Settings
                ├── Admin user management
                ├── Export data (CSV/JSON)
                └── Audit log
```

### 3.3 Consultation History Flow

```
User → Riwayat Konsultasi
         ├── List semua sesi (by date)
         ├── Filter by penyakit / tanggal
         ├── Detail per sesi (gejala + hasil)
         └── Export / Share hasil
```

---

## 4. Feature List

### 4.1 Fitur User

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| Guided Consultation | P0 | Multi-step form pilih gejala dengan 5-level keyakinan |
| CF Visualization | P0 | Animated progress bar + confidence score untuk setiap diagnosis |
| Explainability Panel | P0 | Breakdown "mengapa" — gejala apa yang berkontribusi berapa % |
| Disease Detail Page | P0 | Info lengkap penyakit: deskripsi, penyebab, saran |
| Session History | P1 | Riwayat konsultasi tanpa login (localStorage) |
| Body Area Filter | P1 | Filter gejala by area: Telinga / Hidung / Tenggorokan |
| Symptom Info Tooltip | P1 | Penjelasan medis singkat per gejala |
| Print / Share Result | P1 | Export hasil diagnosa sebagai PDF atau share link |
| Saved Sessions | P2 | Simpan dan akses riwayat (perlu login) |
| Comparison Mode | P2 | Bandingkan hasil konsultasi berbeda waktu |
| Dark Mode | P2 | Toggle dark/light tema |

### 4.2 Fitur Admin

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| Secure Login | P0 | JWT auth dengan refresh token |
| Dashboard Overview | P0 | KPI cards: total konsultasi, penyakit terbanyak, dll |
| Symptoms CRUD | P0 | Tambah/edit/hapus gejala beserta kategori dan deskripsi |
| Diseases CRUD | P0 | Kelola data penyakit dengan rich text editor |
| CF Rules Matrix | P0 | Visual editor: tabel disease × symptom × weight |
| Consultation Log | P1 | Semua sesi konsultasi (anonymized) |
| Analytics Dashboard | P1 | Chart trend, heatmap gejala, top diagnosis |
| Bulk Import | P1 | Import knowledge base dari CSV/JSON |
| Data Export | P1 | Export semua data untuk backup/analisis |
| Audit Log | P2 | Log perubahan knowledge base (siapa, apa, kapan) |
| Admin Management | P2 | Multi-admin dengan role: superadmin / editor |

### 4.3 Fitur Expert (Knowledge Engineer)

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| CF Weight Simulator | P1 | Simulasi bagaimana perubahan bobot mempengaruhi hasil |
| Rule Testing Console | P1 | Test rule dengan input gejala custom, lihat output CF |
| Knowledge Base Versioning | P2 | Track perubahan rule dengan version history |
| A/B Rule Comparison | P2 | Bandingkan dua versi rule, lihat perbedaan output |

### 4.4 Fitur Analytics

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| Disease Frequency Chart | P1 | Bar/pie chart diagnosis terbanyak |
| Symptom Heatmap | P1 | Heatmap gejala yang paling sering dipilih |
| Confidence Distribution | P1 | Histogram nilai CF dari semua konsultasi |
| Time Series Trend | P1 | Tren konsultasi per hari/minggu/bulan |
| Symptom Co-occurrence | P2 | Gejala mana yang sering dipilih bersamaan |
| Geographic Distribution | P2 | Distribusi konsultasi per kota (jika user share lokasi) |

---

## 5. Frontend Architecture

### 5.1 Framework & Tools

```
Framework   : React 18 + TypeScript
Build Tool  : Vite 5
Routing     : React Router v6
State       : Zustand (global) + TanStack Query (server state)
Forms       : React Hook Form + Zod
Styling     : Tailwind CSS v3 + CSS Variables
Animation   : Framer Motion
Charts      : Recharts
Icons       : Lucide React
UI Base     : shadcn/ui (headless, customizable)
HTTP Client : Axios
```

**Mengapa Zustand, bukan Redux?**
Lebih ringan, boilerplate minimal, cocok untuk project mid-size ini.

**Mengapa Framer Motion?**
Animasi smooth dan deklaratif — penting untuk feel "AI yang berpikir" dan confidence meter animation.

### 5.2 Struktur Folder Frontend

```
frontend/
├── public/
│   └── assets/                   # Static assets
├── src/
│   ├── app/                      # App-level setup
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── Providers.tsx         # QueryClient, Theme, etc.
│   │
│   ├── pages/                    # Route-level components
│   │   ├── landing/
│   │   │   └── LandingPage.tsx
│   │   ├── consultation/
│   │   │   ├── ConsultationPage.tsx
│   │   │   ├── ResultPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── disease/
│   │   │   └── DiseaseDetailPage.tsx
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── SymptomsPage.tsx
│   │       ├── DiseasesPage.tsx
│   │       ├── RulesPage.tsx
│   │       └── AnalyticsPage.tsx
│   │
│   ├── components/
│   │   ├── consultation/
│   │   │   ├── SymptomCard.tsx        # Single symptom input card
│   │   │   ├── SymptomGroup.tsx       # Group of symptoms by category
│   │   │   ├── ConsultationStepper.tsx # Multi-step progress indicator
│   │   │   ├── BodyAreaFilter.tsx     # Telinga/Hidung/Tenggorokan filter
│   │   │   └── ProcessingAnimation.tsx # "AI thinking" animation
│   │   │
│   │   ├── result/
│   │   │   ├── DiagnosisCard.tsx      # Primary/Secondary diagnosis card
│   │   │   ├── CFConfidenceMeter.tsx  # Animated arc/radial meter
│   │   │   ├── CFProgressBar.tsx      # Horizontal animated bar
│   │   │   ├── ExplainabilityPanel.tsx # "Why this diagnosis" section
│   │   │   ├── ContributionChart.tsx  # Bar chart: symptom contributions
│   │   │   └── ResultActions.tsx      # Print, Share, Restart buttons
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── CFRuleMatrix.tsx       # Interactive rule weight table
│   │   │   ├── KPICard.tsx
│   │   │   └── DataTable.tsx          # Reusable table with sorting/filter
│   │   │
│   │   ├── shared/
│   │   │   ├── MedicalDisclaimer.tsx  # Non-dismissible disclaimer
│   │   │   ├── Navbar.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   └── ui/                        # shadcn/ui base components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── slider.tsx
│   │       ├── tooltip.tsx
│   │       └── dialog.tsx
│   │
│   ├── hooks/
│   │   ├── useConsultation.ts         # Consultation state & submission
│   │   ├── useSymptoms.ts             # Fetch symptoms from API
│   │   ├── useDiseases.ts             # Fetch diseases from API
│   │   ├── useAnalytics.ts            # Admin analytics data
│   │   └── useLocalHistory.ts         # LocalStorage session history
│   │
│   ├── stores/
│   │   ├── consultationStore.ts       # Zustand: current session state
│   │   ├── authStore.ts               # Zustand: admin auth state
│   │   └── themeStore.ts              # Zustand: dark/light mode
│   │
│   ├── lib/
│   │   ├── api.ts                     # Axios instance + interceptors
│   │   ├── queryKeys.ts               # TanStack Query key factory
│   │   └── utils.ts                   # cn(), formatters, helpers
│   │
│   ├── types/
│   │   ├── consultation.ts
│   │   ├── diagnosis.ts
│   │   ├── admin.ts
│   │   └── api.ts
│   │
│   └── constants/
│       ├── symptoms.ts                # Fallback symptom data
│       └── config.ts                  # App constants
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 5.3 State Management Strategy

```typescript
// Zustand Store: Consultation Session
interface ConsultationStore {
  // State
  selectedSymptoms: Map<string, number>  // symptomCode → userWeight
  currentStep: 'filter' | 'symptoms' | 'processing' | 'result'
  activeFilter: 'all' | 'telinga' | 'hidung' | 'tenggorokan' | 'umum'
  result: DiagnosisResult[] | null
  sessionId: string | null

  // Actions
  setSymptomWeight: (code: string, weight: number) => void
  removeSymptom: (code: string) => void
  resetConsultation: () => void
  setResult: (result: DiagnosisResult[]) => void
  setStep: (step: string) => void
}

// TanStack Query: Server State
// - useQuery(['symptoms']) → GET /api/symptoms
// - useQuery(['diseases']) → GET /api/diseases
// - useQuery(['disease', id]) → GET /api/diseases/:id
// - useMutation → POST /api/diagnose
```

### 5.4 UI Style & Animation Principles

**Design Philosophy:** Medical Dashboard meets Fintech App

- **Spacing**: Generous whitespace, cards never feel cramped
- **Motion**: All transitions 200–400ms with ease-out curves
- **Color**: Meaningful color coding (confidence levels)
- **Typography**: Sharp, clinical, readable

**Key Animation Moments:**
```
1. Confidence Meter: 0% → actual% dengan spring animation (1.2s)
2. Processing Screen: pulsing orb + floating particles (Framer Motion)
3. Card Entry: staggered fade-in dari bawah (setiap card +80ms delay)
4. Explainability bars: cascade reveal dari kiri ke kanan
5. Theme toggle: smooth color interpolation
```

---

## 6. Backend Architecture

### 6.1 Keputusan Arsitektur

**Pilihan: Next.js sebagai Backend API (API Routes only)**

Alasan:
- Single deployment → backend + serving frontend statis dari satu platform (Vercel/Railway)
- App Router API Routes sangat cocok untuk REST API patterns
- Native TypeScript support
- Edge Runtime support untuk response cepat
- Middleware bawaan untuk JWT protection

```
Frontend (React/Vite) → Deploy ke Vercel / Cloudflare Pages
Backend (Next.js)     → Deploy ke Vercel / Railway
Database (PostgreSQL) → Neon / Supabase / Railway
```

### 6.2 Folder Structure Backend

```
backend/
├── app/
│   └── api/
│       ├── symptoms/
│       │   └── route.ts              # GET /api/symptoms
│       ├── diseases/
│       │   ├── route.ts              # GET /api/diseases
│       │   └── [id]/
│       │       └── route.ts          # GET /api/diseases/:id
│       ├── diagnose/
│       │   └── route.ts              # POST /api/diagnose
│       ├── sessions/
│       │   └── [id]/
│       │       └── route.ts          # GET /api/sessions/:id
│       └── admin/
│           ├── auth/
│           │   ├── login/route.ts    # POST /api/admin/auth/login
│           │   └── logout/route.ts  # POST /api/admin/auth/logout
│           ├── symptoms/
│           │   ├── route.ts          # GET, POST
│           │   └── [id]/route.ts    # PUT, DELETE
│           ├── diseases/
│           │   ├── route.ts          # GET, POST
│           │   └── [id]/route.ts    # PUT, DELETE
│           ├── rules/
│           │   ├── route.ts          # GET, POST
│           │   └── [id]/route.ts    # PUT, DELETE
│           └── analytics/
│               └── route.ts          # GET /api/admin/analytics
│
├── lib/
│   ├── cfEngine.ts                   # CF calculation (pure function)
│   ├── cfExplainer.ts                # Generate explanation text
│   ├── prisma.ts                     # Prisma singleton
│   ├── auth.ts                       # JWT sign/verify with jose
│   ├── rateLimit.ts                  # In-memory rate limiter
│   └── validation/
│       ├── diagnose.schema.ts        # Zod schemas
│       ├── symptom.schema.ts
│       ├── disease.schema.ts
│       └── rule.schema.ts
│
├── middleware.ts                     # JWT guard for /api/admin/*
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                       # Full seed dari jurnal
│
├── types/
│   ├── cf.ts                         # CF engine types
│   └── api.ts                        # API response types
│
├── next.config.ts
├── package.json
└── tsconfig.json
```

### 6.3 Service Architecture

```typescript
// Layered Architecture:
// Route Handler → Validation → Service → Repository → DB

// Example: POST /api/diagnose
// 1. Route Handler validates request (Zod)
// 2. Calls DiagnoseService.run(symptoms)
// 3. DiagnoseService:
//    a. Fetches CF rules from RuleRepository
//    b. Calls CFEngine.calculate(symptoms, rules)
//    c. Calls CFExplainer.generate(results, symptoms, rules)
//    d. Saves session via SessionRepository
//    e. Returns enriched results
```

### 6.4 Response Format Standard

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {              // optional
    "total": 24,
    "page": 1
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "userWeight must be one of [0.2, 0.4, 0.6, 0.8, 1.0]",
    "details": [...]    // optional field-level errors
  }
}
```

---

## 7. Knowledge Base Design

### 7.1 Symptom Data Structure

```typescript
interface Symptom {
  id: string
  code: string          // "G001"
  name: string          // "Batuk"
  nameEn: string        // "Cough" (untuk aksesibilitas)
  category: SymptomCategory
  description: string   // Penjelasan medis singkat untuk tooltip
  bodyArea: BodyArea    // untuk visual body diagram
  severity: 'low' | 'medium' | 'high'  // indikator visual
  isActive: boolean
}

type SymptomCategory = 'telinga' | 'hidung' | 'tenggorokan' | 'umum'
type BodyArea = 'ear' | 'nose' | 'throat' | 'head' | 'general'
```

### 7.2 Disease Data Structure

```typescript
interface Disease {
  id: string
  code: string          // "P001"
  name: string          // "Otitis Media Akut (OMA)"
  nameShort: string     // "OMA" (untuk badge kecil)
  category: string      // "Penyakit Telinga"
  severity: 'mild' | 'moderate' | 'severe'
  description: string   // Rich text HTML
  causes: string        // Rich text HTML
  generalSymptoms: string
  treatmentAdvice: string
  whenToSeeDoctor: string  // "Segera ke dokter jika..."
  relatedDiseases: string[] // Disease IDs
  icdCode: string       // ICD-10 code (untuk profesionalisme)
  iconKey: string       // untuk icon selector
  isActive: boolean
}
```

### 7.3 CF Rule Structure

```typescript
interface CFRule {
  id: string
  diseaseId: string
  symptomId: string
  expertWeight: CFWeight  // 0.2 | 0.4 | 0.6 | 0.8 | 1.0
  rationale: string       // Penjelasan mengapa bobot ini
  addedBy: string         // Expert yang menambahkan
  version: number
  isActive: boolean
}

type CFWeight = 0.2 | 0.4 | 0.6 | 0.8 | 1.0
```

### 7.4 Complete Knowledge Base dari Jurnal

**Symptoms (24 gejala):**

| Code | Nama | Kategori | Area | Severity |
|------|------|----------|------|----------|
| G001 | Batuk | umum | general | low |
| G002 | Bersin | hidung | nose | low |
| G003 | Dahak mengalir di tenggorok | tenggorokan | throat | medium |
| G004 | Demam | umum | general | medium |
| G005 | Hidung mampet | hidung | nose | low |
| G006 | Hidung mampet sebelah | hidung | nose | medium |
| G007 | Hidung mampet bergantian | hidung | nose | medium |
| G008 | Ingus bau | hidung | nose | medium |
| G009 | Riwayat mengorek telinga | telinga | ear | medium |
| G010 | Penciuman berkurang | hidung | nose | medium |
| G011 | Pendengaran berkurang | telinga | ear | high |
| G012 | Pilek encer di kedua hidung | hidung | nose | low |
| G013 | Pilek | hidung | nose | low |
| G014 | Sakit kepala | umum | head | medium |
| G015 | Telinga berair ≥ 2 bulan | telinga | ear | high |
| G016 | Telinga berair ≤ 2 bulan | telinga | ear | medium |
| G017 | Telinga berair bau ≥ 2 bulan | telinga | ear | high |
| G018 | Telinga mampet | telinga | ear | medium |
| G019 | Telinga gatal | telinga | ear | low |
| G020 | Telinga nyeri | telinga | ear | high |
| G021 | Tenggorok nyeri | tenggorokan | throat | medium |
| G022 | Telinga nyeri saat mengunyah | telinga | ear | medium |
| G023 | Telinga berdengung | telinga | ear | medium |
| G024 | Tidur mendengkur | tenggorokan | throat | medium |

**CF Rules (bobot pakar, sumber: dr. M. Agus Sugicharto Sp.THT):**

```
P001 — Otitis Media Akut:
  G001=0.8, G004=0.8, G011=0.6, G013=0.8,
  G014=0.4, G016=0.8, G020=1.0, G023=0.6

P002 — Serumen:
  G009=0.4, G011=0.8, G018=1.0, G019=0.2

P003 — Otitis Eksterna:
  G009=0.8, G011=0.8, G016=0.4, G018=0.6,
  G019=0.8, G020=1.0, G023=0.6

P004 — Sinusitis:
  G001=0.4, G003=0.8, G004=0.4, G005=0.4,
  G006=0.6, G010=0.6, G012=0.6, G014=1.0

P005 — Rhinitis Kronis:
  G010=0.6, G007=0.8, G012=1.0, G013=1.0,
  G005=0.8, G002=0.8, G014=0.4
```

---

## 8. Certainty Factor Engine

### 8.1 CF Engine Implementation (TypeScript)

```typescript
// backend/lib/cfEngine.ts

export type CFWeight = 0.2 | 0.4 | 0.6 | 0.8 | 1.0

export interface SymptomInput {
  symptomCode: string
  userWeight: number  // validated: one of CFWeight values
}

export interface CFRuleData {
  diseaseCode: string
  diseaseName: string
  symptomCode: string
  symptomName: string
  expertWeight: number
}

export interface SymptomContribution {
  symptomCode: string
  symptomName: string
  userWeight: number
  expertWeight: number
  cfValue: number
  contributionPercent: number  // relative to final CF
}

export interface DiagnosisResult {
  diseaseCode: string
  diseaseName: string
  cfValue: number
  cfPercentage: string         // "91.7%"
  confidenceLevel: ConfidenceLevel
  rank: number
  contributingSymptoms: SymptomContribution[]
  iterationSteps: IterationStep[]  // for explainability
}

export type ConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low'

export interface IterationStep {
  iteration: number
  symptomCode: string
  symptomName: string
  cfBefore: number
  cfAdded: number
  cfAfter: number
  formula: string  // "0.604 + 0.48 × (1 - 0.604) = 0.794"
}

export function calculateCF(
  userSymptoms: SymptomInput[],
  cfRules: CFRuleData[]
): DiagnosisResult[] {
  // 1. Index user symptoms for O(1) lookup
  const userMap = new Map(
    userSymptoms.map(s => [s.symptomCode, s.userWeight])
  )

  // 2. Group rules by disease
  const diseaseMap = new Map<string, CFRuleData[]>()
  for (const rule of cfRules) {
    if (!diseaseMap.has(rule.diseaseCode)) {
      diseaseMap.set(rule.diseaseCode, [])
    }
    diseaseMap.get(rule.diseaseCode)!.push(rule)
  }

  const results: DiagnosisResult[] = []

  // 3. Calculate CF per disease
  for (const [diseaseCode, rules] of diseaseMap) {
    const contributions: SymptomContribution[] = []
    const cfValues: { value: number; rule: CFRuleData; userWeight: number }[] = []

    for (const rule of rules) {
      const userWeight = userMap.get(rule.symptomCode)
      if (userWeight === undefined || userWeight === 0) continue

      const cfValue = parseFloat((userWeight * rule.expertWeight).toFixed(4))
      cfValues.push({ value: cfValue, rule, userWeight })
    }

    if (cfValues.length === 0) continue

    // 4. Combine CF iteratively with step tracking
    const iterationSteps: IterationStep[] = []
    let cfCombined = cfValues[0].value

    for (let i = 1; i < cfValues.length; i++) {
      const cf2 = cfValues[i].value
      const cfBefore = cfCombined
      const newCF = cfCombined + cf2 * (1 - cfCombined)
      cfCombined = parseFloat(newCF.toFixed(4))

      iterationSteps.push({
        iteration: i,
        symptomCode: cfValues[i].rule.symptomCode,
        symptomName: cfValues[i].rule.symptomName,
        cfBefore,
        cfAdded: cf2,
        cfAfter: cfCombined,
        formula: `${cfBefore.toFixed(3)} + ${cf2.toFixed(3)} × (1 - ${cfBefore.toFixed(3)}) = ${cfCombined.toFixed(3)}`
      })
    }

    // Filter low confidence
    if (cfCombined < 0.1) continue

    // 5. Calculate contribution percentage per symptom
    const totalCF = cfValues.reduce((sum, cv) => sum + cv.value, 0)
    for (const cv of cfValues) {
      contributions.push({
        symptomCode: cv.rule.symptomCode,
        symptomName: cv.rule.symptomName,
        userWeight: cv.userWeight,
        expertWeight: cv.rule.expertWeight,
        cfValue: cv.value,
        contributionPercent: parseFloat(((cv.value / totalCF) * 100).toFixed(1))
      })
    }

    results.push({
      diseaseCode,
      diseaseName: rules[0].diseaseName,
      cfValue: cfCombined,
      cfPercentage: `${(cfCombined * 100).toFixed(1)}%`,
      confidenceLevel: getConfidenceLevel(cfCombined),
      rank: 0,
      contributingSymptoms: contributions.sort((a, b) => b.cfValue - a.cfValue),
      iterationSteps
    })
  }

  // 6. Sort, rank, return top 3
  return results
    .sort((a, b) => b.cfValue - a.cfValue)
    .slice(0, 3)
    .map((r, i) => ({ ...r, rank: i + 1 }))
}

function getConfidenceLevel(cf: number): ConfidenceLevel {
  if (cf >= 0.8) return 'very_high'
  if (cf >= 0.6) return 'high'
  if (cf >= 0.4) return 'medium'
  return 'low'
}
```

### 8.2 CF Explainer (Explainability Layer)

```typescript
// backend/lib/cfExplainer.ts
// Generates human-readable explanation for diagnosis result

export function generateExplanation(result: DiagnosisResult): string {
  const { diseaseName, cfPercentage, contributingSymptoms, confidenceLevel } = result

  const levelText = {
    very_high: 'sangat tinggi',
    high: 'tinggi',
    medium: 'cukup',
    low: 'rendah'
  }[confidenceLevel]

  const topSymptoms = contributingSymptoms
    .slice(0, 3)
    .map(s => `"${s.symptomName}" (kontribusi ${s.contributionPercent}%)`)
    .join(', ')

  return `Sistem mendiagnosis ${diseaseName} dengan tingkat keyakinan ${levelText} (${cfPercentage}). ` +
    `Gejala yang paling berkontribusi adalah: ${topSymptoms}.`
}
```

### 8.3 Inference Mechanism Summary

```
INPUT VALIDATION
↓
SYMPTOM LOOKUP (user selections → Map for O(1) access)
↓
RULE MATCHING (per disease: find intersecting symptoms)
↓
CF CALCULATION (userWeight × expertWeight per symptom)
↓
ITERATIVE COMBINATION (CF1 + CF2×(1-CF1), repeated)
↓
CONFIDENCE LEVEL ASSIGNMENT (very_high/high/medium/low)
↓
CONTRIBUTION ANALYSIS (% per symptom for explainability)
↓
ITERATION STEP RECORDING (full formula trace)
↓
FILTER (CF < 0.1 → excluded)
↓
SORT DESCENDING + TAKE TOP 3
↓
EXPLANATION GENERATION
↓
SESSION SAVE
↓
RESPONSE
```

---

## 9. Database Design

### 9.1 Prisma Schema Lengkap

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── KNOWLEDGE BASE ───────────────────────────────────────

model Disease {
  id               String   @id @default(cuid())
  code             String   @unique  // "P001"
  name             String
  nameShort        String            // "OMA"
  category         String            // "Penyakit Telinga"
  severity         String   @default("moderate")  // mild/moderate/severe
  description      String   @db.Text
  causes           String   @db.Text
  generalSymptoms  String   @db.Text
  treatmentAdvice  String   @db.Text
  whenToSeeDoctor  String   @db.Text
  icdCode          String?           // ICD-10 code
  iconKey          String   @default("ear")
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  cfRules          CFRule[]
  consultResults   ConsultationResult[]

  @@index([code])
}

model Symptom {
  id          String   @id @default(cuid())
  code        String   @unique  // "G001"
  name        String
  nameEn      String?
  category    String            // telinga/hidung/tenggorokan/umum
  bodyArea    String            // ear/nose/throat/head/general
  description String   @db.Text // Tooltip explanation
  severity    String   @default("medium")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cfRules     CFRule[]

  @@index([code])
  @@index([category])
}

model CFRule {
  id           String   @id @default(cuid())
  disease      Disease  @relation(fields: [diseaseId], references: [id], onDelete: Cascade)
  diseaseId    String
  symptom      Symptom  @relation(fields: [symptomId], references: [id], onDelete: Cascade)
  symptomId    String
  expertWeight Float             // 0.2 | 0.4 | 0.6 | 0.8 | 1.0
  rationale    String?  @db.Text // Expert reasoning
  version      Int      @default(1)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([diseaseId, symptomId])
  @@index([diseaseId])
  @@index([symptomId])
}

// ─── CONSULTATION ──────────────────────────────────────────

model ConsultationSession {
  id             String   @id @default(cuid())
  sessionToken   String   @unique @default(cuid()) // for shareable link
  ipHash         String?  // hashed IP for rate limiting
  inputSymptoms  Json     // SymptomInput[]
  rawResults     Json     // Full DiagnosisResult[] with explainability
  durationMs     Int?     // time from start to result (ms)
  userAgent      String?
  createdAt      DateTime @default(now())

  results        ConsultationResult[]

  @@index([sessionToken])
  @@index([createdAt])
}

model ConsultationResult {
  id             String   @id @default(cuid())
  session        ConsultationSession @relation(fields: [sessionId], references: [id])
  sessionId      String
  disease        Disease  @relation(fields: [diseaseId], references: [id])
  diseaseId      String
  cfValue        Float
  rank           Int
  createdAt      DateTime @default(now())

  @@index([diseaseId])
  @@index([sessionId])
}

// ─── ADMIN ────────────────────────────────────────────────

model AdminUser {
  id           String      @id @default(cuid())
  email        String      @unique
  passwordHash String
  name         String
  role         AdminRole   @default(EDITOR)
  isActive     Boolean     @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  auditLogs    AuditLog[]
}

enum AdminRole {
  SUPERADMIN
  EDITOR
}

model AuditLog {
  id         String    @id @default(cuid())
  admin      AdminUser @relation(fields: [adminId], references: [id])
  adminId    String
  action     String    // "UPDATE_CF_RULE" | "ADD_SYMPTOM" | etc.
  entityType String    // "CFRule" | "Symptom" | "Disease"
  entityId   String
  before     Json?     // previous state
  after      Json?     // new state
  createdAt  DateTime  @default(now())

  @@index([adminId])
  @@index([createdAt])
}
```

### 9.2 Entity Relationship Diagram

```
Disease ────────────────────── CFRule ──────────────────── Symptom
  │ (1)              (many) │         │ (many)           (1) │
  │                         │         │                       │
  └─── ConsultationResult ──┘         └── [many-to-many] ────┘
              │ (many)
              │
  ConsultationSession (1) ──── ConsultationResult (many)

AdminUser ──── AuditLog (track all KB changes)
```

---

## 10. UI/UX Design Direction

### 10.1 Design Philosophy

**"Clinical Clarity meets Digital Sophistication"**

Bukan UI rumah sakit yang dingin dan membosankan. Bukan juga aplikasi consumer biasa. ClaraTHT berada di tengah — **professional healthcare meets modern SaaS product design**.

Referensi visual: Linear.app + Stripe Dashboard + Apple Health

### 10.2 Color System

```css
/* Light Mode */
--color-primary: #0EA5E9;          /* Sky Blue — trust, medical */
--color-primary-dark: #0284C7;
--color-secondary: #8B5CF6;        /* Violet — AI, intelligence */
--color-accent: #06B6D4;           /* Cyan — energy, tech */

--color-surface: #FFFFFF;
--color-surface-subtle: #F8FAFC;
--color-surface-muted: #F1F5F9;
--color-border: #E2E8F0;
--color-border-subtle: #F1F5F9;

--color-text-primary: #0F172A;
--color-text-secondary: #475569;
--color-text-muted: #94A3B8;

/* Confidence Level Colors */
--color-cf-very-high: #10B981;     /* Emerald */
--color-cf-high: #3B82F6;          /* Blue */
--color-cf-medium: #F59E0B;        /* Amber */
--color-cf-low: #EF4444;           /* Red */

/* Dark Mode */
--color-surface-dark: #0F172A;
--color-surface-subtle-dark: #1E293B;
--color-surface-muted-dark: #334155;
--color-border-dark: #334155;
--color-text-primary-dark: #F8FAFC;
--color-text-secondary-dark: #94A3B8;
```

### 10.3 Typography

```css
/* Font Stack */
--font-sans: 'Inter', system-ui, sans-serif;       /* UI text */
--font-mono: 'JetBrains Mono', monospace;           /* Numbers, code */
--font-display: 'Plus Jakarta Sans', sans-serif;    /* Headings */

/* Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### 10.4 Component Style Guide

**Symptom Cards:**
```
┌─────────────────────────────────────────────────────┐
│  🔊 Telinga Nyeri                          G020     │
│  ──────────────────────────────────────────────     │
│  Rasa nyeri atau sakit di dalam telinga             │
│                                                     │
│  ○ Ragu-ragu  ○ Mungkin  ● Sangat Mungkin  ○ …    │
│               [━━━━━━━━━━●━━━━━━━━━] 0.6           │
└─────────────────────────────────────────────────────┘
```

**Diagnosis Result Card (Primary):**
```
┌─────────────────────────────────────────────────────┐
│  DIAGNOSIS UTAMA                          #1        │
│  ─────────────                                      │
│  Sinusitis                                          │
│                                                     │
│  Tingkat Keyakinan                                  │
│  ████████████████████░░░░░░  91.7%                 │
│                              SANGAT TINGGI          │
│                                                     │
│  Gejala yang berkontribusi:                         │
│  • Sakit kepala       ████████████  35%             │
│  • Pilek              ██████████    28%             │
│  • Batuk              ████████      22%             │
│  • Hidung mampet      ██████        15%             │
│                                                     │
│        [Lihat Detail]    [Simpan Hasil]             │
└─────────────────────────────────────────────────────┘
```

**Explainability Panel:**
```
┌─────────────────────────────────────────────────────┐
│  🔍 Mengapa sistem menyimpulkan ini?                │
│  ──────────────────────────────────                 │
│                                                     │
│  Sistem mendeteksi 4 gejala yang cocok dengan       │
│  profil Sinusitis dalam basis pengetahuan pakar.    │
│                                                     │
│  Perhitungan Iteratif:                              │
│  Step 1: CF = 0.48 (Batuk × bobot pakar 0.4)       │
│  Step 2: 0.48 + 0.60×(1-0.48) = 0.794             │
│  Step 3: 0.794 + 0.48×(1-0.794) = 0.917   ✓       │
│                                                     │
│  Bobot pakar dari: dr. M. Agus Sugicharto Sp.THT    │
└─────────────────────────────────────────────────────┘
```

### 10.5 Dashboard Admin Style

```
Modern SaaS Dashboard:
- Sidebar kiri dengan nav items + icon
- Header dengan breadcrumb + user avatar
- Content area dengan grid layout
- KPI cards dengan trend indicator (↑ ↓)
- Charts yang clean (tidak penuh warna)
- Tables dengan hover state dan actions
- Status badges dengan color coding
```

### 10.6 Responsive Behavior

```
Mobile (< 640px):
- Single column layout
- Symptom cards full-width
- Confidence meter as full-width bar (no radial)
- Bottom navigation (mobile-friendly)
- Swipe gesture untuk navigation

Tablet (640–1024px):
- 2-column grid untuk symptom cards
- Sidebar collapsed by default
- Result cards side by side

Desktop (> 1024px):
- Sidebar visible
- 3-column grid untuk symptom cards
- Split view: symptoms list | preview panel
```

---

## 11. Pages Structure

### 11.1 Public Pages

```
/ (Landing Page)
├── Hero: tagline + CTA button + animated visual
├── How It Works: 3-step visual explanation
├── Statistics: "X+ konsultasi" counter animation
├── Medical Disclaimer: professional, non-intrusive
├── Diseases Overview: card grid 5 penyakit
└── Footer: referensi jurnal, links

/konsultasi (Consultation Page)
├── Step 1: Area Filter (Telinga/Hidung/Tenggorokan/Semua)
├── Step 2: Symptom Selection Form
│   ├── Progress bar di atas
│   ├── Grouped symptom cards
│   ├── Counter "X dipilih"
│   └── CTA: Diagnosa / Reset
└── Loading state: "Sistem sedang menganalisis..."

/hasil (Result Page)
├── MedicalDisclaimer (top, persistent)
├── Session Info (timestamp)
├── Primary Diagnosis Card
│   ├── Disease name + severity badge
│   ├── Animated confidence meter
│   ├── Symptom contribution chart
│   └── Action buttons
├── Secondary Diagnoses (rank 2-3, smaller)
├── Explainability Panel (expandable)
│   ├── Human-readable explanation
│   ├── Iteration steps table
│   └── "Tentang Metode CF" link
└── Actions: Mulai Ulang | Simpan | Cetak | Bagikan

/penyakit (Disease List)
├── Filter by category
├── Search
└── Disease cards grid

/penyakit/:id (Disease Detail)
├── Disease header (name, ICD code, severity)
├── Tab: Deskripsi | Gejala | Penyebab | Penanganan
├── Related Diseases
├── "Mulai Konsultasi" CTA
└── MedicalDisclaimer

/riwayat (History Page)
├── List sesi dari localStorage
├── Each entry: date, result, symptoms count
├── Click: full result detail
└── Clear history button

/tentang (About Page)
├── Tentang Sistem
├── Metodologi (CF explanation)
├── Sumber Pakar
├── Referensi Jurnal
└── Disclaimer lengkap
```

### 11.2 Admin Pages

```
/admin/login (Admin Login)
├── Email + Password form
├── JWT stored in httpOnly cookie
└── Redirect to /admin/dashboard

/admin (Dashboard)
├── KPI Row: Total Konsultasi | Hari Ini | Top Penyakit | Avg CF
├── Chart: Konsultasi per hari (7/30 hari)
├── Chart: Top 5 Diagnosis (bar chart)
├── Recent Sessions table
└── Quick Links

/admin/gejala (Symptoms Management)
├── Search + Filter by category
├── Table: Code | Nama | Kategori | Status | Actions
├── Modal: Add/Edit Symptom
└── Bulk actions

/admin/penyakit (Disease Management)
├── Table: Code | Nama | Kategori | Severity | Status
├── Modal/Drawer: Add/Edit Disease (rich text editor)
└── Preview mode

/admin/rules (CF Rules Management)
├── Visual Matrix: Disease (rows) × Symptom (cols) × Weight (cell)
├── Click cell → edit weight with validation
├── Color coding: 1.0=darkest, 0.2=lightest
├── Export to CSV
└── Import from CSV

/admin/analytics (Analytics)
├── Date range picker
├── Konsultasi trend (line chart)
├── Symptom frequency heatmap
├── CF value distribution (histogram)
├── Penyakit breakdown (pie chart)
└── Export report

/admin/audit (Audit Log)
├── Timeline of all KB changes
├── Filter: admin | entity type | date
└── Diff view (before/after)
```

---

## 12. AI Agent Development Plan

> Instruksi step-by-step untuk Claude Code / Cursor / Windsurf atau AI coding agent lainnya.
> Copy setiap blok instruksi secara berurutan.

---

### SYSTEM PROMPT (Paste ke AI Agent sebelum mulai)

```
You are a senior full-stack TypeScript developer building "ClaraTHT" — a modern
Explainable AI Expert System for ENT (Telinga, Hidung, Tenggorokan) disease diagnosis.

CORE ARCHITECTURE:
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Zustand
- Backend: Next.js 14 (App Router, API Routes only)
- Database: PostgreSQL + Prisma ORM
- Auth: JWT with jose library (httpOnly cookies for admin)
- Validation: Zod on both frontend and backend
- Styling: Tailwind CSS v3 + shadcn/ui + CSS variables

CRITICAL DOMAIN RULES (never deviate):
1. CF Engine is a pure function in /lib/cfEngine.ts — no side effects, no DB calls
2. CF formula: cf_per_symptom = user_weight × expert_weight
3. CF combination: cf_combined = cf1 + cf2 × (1 - cf1), applied iteratively
4. Only return diseases with CF >= 0.1
5. Max 3 diseases in results, sorted descending by CF
6. Medical disclaimer MUST appear on all result pages — non-dismissible
7. All 24 symptoms, 5 diseases, and 5 CF rules from the journal must be seeded exactly
8. Explainability is a first-class feature: always include iteration steps in results

DESIGN PRINCIPLES:
- Do NOT make this look like an academic form-based system
- Every page should feel like a modern healthtech product
- Use Framer Motion for meaningful micro-animations
- Color-code confidence levels: very_high=emerald, high=blue, medium=amber, low=red
- shadcn/ui for base components, heavily customized with Tailwind
```

---

### STEP 1: Project Setup

```
Task: Initialize monorepo with frontend (Vite/React) and backend (Next.js)

1. Create root directory: claratht/
2. Setup frontend:
   cd claratht
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install tailwindcss framer-motion zustand @tanstack/react-query
   npm install react-router-dom react-hook-form zod axios
   npm install lucide-react recharts
   npx shadcn-ui@latest init
   npx tailwindcss init -p

3. Setup backend:
   cd ..
   npx create-next-app@latest backend --typescript --app --no-src-dir --no-tailwind
   cd backend
   npm install prisma @prisma/client zod jose bcryptjs
   npm install @types/bcryptjs
   npx prisma init

4. Configure CORS in next.config.ts
5. Create .env files for both frontend and backend
6. Create root package.json with workspaces (optional)
```

---

### STEP 2: Database Schema & Prisma Setup

```
Task: Implement complete Prisma schema

File: backend/prisma/schema.prisma

Create all models:
- Disease (with all fields from Section 9.1)
- Symptom (with category, bodyArea, description)
- CFRule (with expertWeight, rationale, version)
- ConsultationSession (with inputSymptoms JSON, rawResults JSON)
- ConsultationResult (junction: session → disease)
- AdminUser (with role enum)
- AuditLog (for KB change tracking)

Run: npx prisma migrate dev --name init
```

---

### STEP 3: Database Seeding

```
Task: Create comprehensive seed file

File: backend/prisma/seed.ts

Seed in this order:
1. AdminUser (1 superadmin: admin@claratht.com / hashed password)
2. Diseases (5 records with FULL content: description, causes, treatment, ICD codes)
3. Symptoms (all 24 records G001-G024 with categories, descriptions, body areas)
4. CFRules (all 5 rules with exact expert weights from journal)

Expert weights (MUST be exact):
P001: G001=0.8, G004=0.8, G011=0.6, G013=0.8, G014=0.4, G016=0.8, G020=1.0, G023=0.6
P002: G009=0.4, G011=0.8, G018=1.0, G019=0.2
P003: G009=0.8, G011=0.8, G016=0.4, G018=0.6, G019=0.8, G020=1.0, G023=0.6
P004: G001=0.4, G003=0.8, G004=0.4, G005=0.4, G006=0.6, G010=0.6, G012=0.6, G014=1.0
P005: G010=0.6, G007=0.8, G012=1.0, G013=1.0, G005=0.8, G002=0.8, G014=0.4

Run: npx prisma db seed
```

---

### STEP 4: CF Engine (Core Algorithm)

```
Task: Implement CF calculation engine as pure function

File: backend/lib/cfEngine.ts

Requirements:
- Pure function: no side effects, no DB calls, no external dependencies
- Input: SymptomInput[] + CFRuleData[]
- Output: DiagnosisResult[] (max 3, sorted desc, CF >= 0.1)
- Track iteration steps for explainability
- Calculate contribution percentage per symptom
- Assign confidence level labels (very_high/high/medium/low)

File: backend/lib/cfExplainer.ts
- generateExplanation(result): string
- generateIterationHTML(steps): string
```

---

### STEP 5: CF Engine Unit Tests

```
Task: Write unit tests for CF engine

File: backend/lib/cfEngine.test.ts

MANDATORY tests (all must pass):
Test 1 — Pasien A → Sinusitis (CF ≈ 0.917):
  Input: G001=0.6, G014=0.6, G013=0.6, G005=0.8
  Assert: rank 1 is P004, cfValue ≥ 0.91

Test 2 — Pasien B → Serumen (CF ≈ 0.951):
  Input: G018=0.8, G011=0.8, G009=0.6, G019=0.6
  Assert: rank 1 is P002, cfValue ≥ 0.94

Test 3 — Pasien C → Otitis Eksterna (CF ≈ 0.963):
  Input: G020=0.6, G019=0.6, G009=0.6, G018=0.8
  Assert: rank 1 is P003, cfValue ≥ 0.94

Test 4 — Pasien D → Rhinitis Kronis (CF ≈ 0.962):
  Input: G012=0.8, G002=0.6, G007=0.6, G014=0.8
  Assert: rank 1 is P005, cfValue ≥ 0.96

Edge cases:
- Empty input → []
- No matching symptoms → []
- Single symptom → cf = user_weight × expert_weight (no combination)
- All CF < 0.1 → []
- Invalid weight → throw error

DO NOT PROCEED to Step 6 until all tests pass.
```

---

### STEP 6: Public API Routes

```
Task: Build all public API endpoints

Files:
- backend/app/api/symptoms/route.ts → GET /api/symptoms
  Response: { success: true, data: Symptom[] }
  Include: group by category

- backend/app/api/diseases/route.ts → GET /api/diseases
  Response: { success: true, data: Disease[] (summary only) }

- backend/app/api/diseases/[id]/route.ts → GET /api/diseases/:id
  Response: { success: true, data: Disease (full detail) }

- backend/app/api/diagnose/route.ts → POST /api/diagnose
  Validation (Zod):
    symptoms: array of { symptomCode: /^G0[0-9]{2}$/, userWeight: [0.2|0.4|0.6|0.8|1.0] }
    min 1 symptom, max 24
  Logic:
    1. Validate input
    2. Fetch CF rules from DB
    3. Run CF engine
    4. Generate explanations
    5. Save consultation session
    6. Return enriched results
  Rate limit: 30 req/min per IP

- backend/app/api/sessions/[id]/route.ts → GET /api/sessions/:token
  Return saved session for history/sharing
```

---

### STEP 7: Admin Auth & Middleware

```
Task: Implement JWT auth for admin

File: backend/middleware.ts
- Protect all routes matching /api/admin/* (except /api/admin/auth/login)
- Verify JWT using jose library
- Return 401 if missing/invalid token
- Use httpOnly cookie for token storage

File: backend/lib/auth.ts
- signJWT(payload): Promise<string>
- verifyJWT(token): Promise<payload>
- hashPassword(password): Promise<string>
- comparePassword(password, hash): Promise<boolean>

File: backend/app/api/admin/auth/login/route.ts
- POST: validate email+password, return JWT in httpOnly cookie

File: backend/app/api/admin/auth/logout/route.ts
- POST: clear cookie
```

---

### STEP 8: Admin CRUD API Routes

```
Task: Build all admin management endpoints

Symptoms CRUD:
- GET /api/admin/symptoms (list with pagination + search)
- POST /api/admin/symptoms (create, validate code uniqueness)
- PUT /api/admin/symptoms/:id (update, log audit)
- DELETE /api/admin/symptoms/:id (soft delete, log audit)

Diseases CRUD:
- GET /api/admin/diseases
- POST /api/admin/diseases
- PUT /api/admin/diseases/:id
- DELETE /api/admin/diseases/:id

CF Rules:
- GET /api/admin/rules (with disease+symptom details)
- POST /api/admin/rules (validate: weight must be 0.2|0.4|0.6|0.8|1.0)
- PUT /api/admin/rules/:id
- DELETE /api/admin/rules/:id

Analytics:
- GET /api/admin/analytics?from=&to=
  Returns: total_sessions, daily_trend[], top_diseases[], symptom_frequency{}

All write operations must:
- Verify JWT
- Validate input with Zod
- Create AuditLog entry
- Return updated entity
```

---

### STEP 9: Frontend Core Setup

```
Task: Setup React frontend foundation

1. Configure Tailwind with custom CSS variables (Section 10.2 colors)
2. Setup React Router v6 with all routes (Section 11)
3. Setup TanStack Query with QueryClient
4. Setup Zustand stores:
   - consultationStore.ts (selected symptoms, step, result)
   - authStore.ts (admin token from cookie)
   - themeStore.ts (dark/light)
5. Setup Axios instance with:
   - Base URL from env
   - Request/response interceptors
   - Error handling (401 → redirect to /admin/login)
6. Setup shadcn/ui components
7. Create CSS variable theme in index.css
8. Create Providers.tsx wrapping: QueryClientProvider + ThemeProvider + RouterProvider
```

---

### STEP 10: Consultation UI

```
Task: Build the consultation flow pages

Components to create:
1. LandingPage.tsx
   - Hero with Framer Motion entrance animation
   - "Mulai Konsultasi" button → /konsultasi
   - 3-step how-it-works section
   - Animated statistic counter

2. ConsultationPage.tsx
   - ConsultationStepper (visual progress: Filter → Pilih → Analisis)
   - BodyAreaFilter: 4 tab pills (Semua/Telinga/Hidung/Tenggorokan)
   - SymptomGroup per category
   - SymptomCard: name + description tooltip + 5-option radio/slider
   - Floating footer: "X dipilih" counter + Diagnosa button
   - Loading transition to result

3. SymptomCard.tsx
   - Card with hover elevation effect
   - Info icon → tooltip with medical description
   - 5 radio buttons with labels
   - Selected state: card border highlight
   - Framer Motion: tap animation

4. ProcessingAnimation.tsx
   - Fullscreen overlay during API call
   - Pulsing orb or brain scan animation (Framer Motion)
   - "Menganalisis X gejala..." text
   - Deliberate minimum 1.5s display time
```

---

### STEP 11: Result & Explainability UI

```
Task: Build diagnosis result pages

Components:
1. ResultPage.tsx
   - Fetch result from navigation state (or sessionId param)
   - MedicalDisclaimer (top, persistent, amber style)
   - DiagnosisCard primary (large)
   - DiagnosisCard secondary (2 smaller cards)
   - ExplainabilityPanel (expandable accordion)
   - ResultActions (Mulai Ulang, Simpan, Cetak, Bagikan)

2. DiagnosisCard.tsx
   - Rank badge (PRIMARY / ALTERNATIF)
   - Disease name (large text)
   - Severity badge
   - CFConfidenceMeter: animated radial or arc meter
   - CF percentage (large number, color-coded)
   - Confidence level label (SANGAT TINGGI / TINGGI / CUKUP)
   - ContributionChart (horizontal bar chart, Recharts)
   - "Lihat Detail Penyakit" button

3. CFConfidenceMeter.tsx
   - Framer Motion: animate from 0 to cfValue × 100
   - Color: emerald (≥80%) | blue (60-79%) | amber (40-59%) | red (<40%)
   - Duration: 1.2s with spring easing

4. ExplainabilityPanel.tsx
   - Accordion reveal
   - Section: "Mengapa sistem menyimpulkan ini?"
   - Human-readable explanation paragraph
   - Iteration steps table (Step N | Gejala | Formula | CF)
   - Note about expert source
   - Link "Pelajari Metode CF"

5. DiseaseDetailPage.tsx
   - Header with disease name, ICD code, severity
   - Tabs: Deskripsi | Penyebab | Gejala | Penanganan
   - "Kapan harus ke dokter" section (highlighted)
   - MedicalDisclaimer
   - CTA: Mulai Konsultasi
```

---

### STEP 12: Admin Panel UI

```
Task: Build admin panel

Pages:
1. AdminLoginPage.tsx
   - Centered card login form
   - Email + password
   - JWT stored in cookie on success

2. AdminLayout.tsx (wrapper for all admin pages)
   - Sidebar with nav: Dashboard | Gejala | Penyakit | Rules | Analytics | Audit
   - Header with admin name + logout
   - Breadcrumb

3. DashboardPage.tsx
   - KPICard × 4: Total Konsultasi | Hari Ini | Top Penyakit | Rata-rata CF
   - LineChart: Tren harian (Recharts)
   - BarChart: Top diagnosis
   - Recent sessions table

4. SymptomsPage.tsx
   - DataTable with: Code | Nama | Kategori | Area | Status | Actions
   - Search input + category filter
   - Add/Edit modal with form validation

5. DiseasesPage.tsx
   - DataTable with all disease fields
   - Drawer for Add/Edit (rich text textarea for description)

6. RulesPage.tsx
   - Matrix view: Disease (rows) × Symptoms (cols)
   - Each cell: show weight value or — if no rule
   - Cell colors: darker = higher weight
   - Click cell → modal to set/clear weight
   - Validates: weight must be 0.2|0.4|0.6|0.8|1.0 or empty

7. AnalyticsPage.tsx
   - Date range filter
   - Charts: LineChart trend, PieChart disease split,
     BarChart symptom frequency, Histogram CF distribution
```

---

### STEP 13: Integration Testing

```
Task: End-to-end integration verification

Manual test checklist:
✅ POST /api/diagnose with Pasien A symptoms → Sinusitis ≥ 0.91
✅ POST /api/diagnose with Pasien B symptoms → Serumen ≥ 0.94
✅ POST /api/diagnose with Pasien C symptoms → Otitis Eksterna ≥ 0.94
✅ POST /api/diagnose with Pasien D symptoms → Rhinitis Kronis ≥ 0.96
✅ Consultation flow: Landing → Select symptoms → Result
✅ Explainability panel shows correct iteration steps
✅ Confidence meter animates correctly
✅ Admin login → Dashboard visible
✅ Admin can add/edit/delete symptoms
✅ CF Rules matrix: edit weight → verify in diagnose endpoint
✅ Medical disclaimer visible on result page (non-dismissible)
✅ Dark mode toggle works
✅ Mobile responsive on iPhone-size viewport
```

---

### STEP 14: Docker & Deployment Setup

```
Task: Containerize the application

Create: docker-compose.yml
  services:
    postgres:
      image: postgres:15-alpine
      env: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
      volumes: postgres_data:/var/lib/postgresql/data
      healthcheck: pg_isready

    backend:
      build: ./backend
      env: DATABASE_URL, JWT_SECRET, ...
      depends_on: postgres (condition: healthy)
      command: sh -c "npx prisma migrate deploy && npx prisma db seed && npm start"

    frontend:
      build: ./frontend
      env: VITE_API_URL

Create: backend/Dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json .
  RUN npm ci
  COPY . .
  RUN npx prisma generate
  RUN npm run build
  CMD ["npm", "start"]

Create: frontend/Dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json .
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80

Create: README.md with full setup instructions
```

---

## 13. Recommended Tech Stack

### 13.1 Full Stack

| Layer | Technology | Version | Alasan |
|-------|-----------|---------|--------|
| **Frontend Framework** | React | 18 | Ecosystem terluas, Concurrent Mode |
| **Build Tool** | Vite | 5 | Fastest HMR, ESM native |
| **Routing** | React Router | v6 | Declarative, nested routes |
| **State (global)** | Zustand | 4 | Minimal boilerplate, lightweight |
| **State (server)** | TanStack Query | v5 | Caching, refetch, stale-while-revalidate |
| **Forms** | React Hook Form | 7 | Performance, minimal re-renders |
| **Validation** | Zod | 3 | TypeScript-first, composable |
| **Styling** | Tailwind CSS | v3 | Utility-first, purge, design system ready |
| **UI Base** | shadcn/ui | latest | Headless, accessible, customizable |
| **Animation** | Framer Motion | 11 | Production-grade, declarative |
| **Charts** | Recharts | 2 | React-native, composable |
| **Icons** | Lucide React | latest | Consistent, tree-shakable |
| **HTTP** | Axios | 1 | Interceptors, consistent API |
| **Backend** | Next.js | 14 (App Router) | API Routes + Edge Runtime |
| **Language** | TypeScript | 5 | Type safety, refactoring |
| **Database** | PostgreSQL | 15 | Reliable, JSONB for flexible data |
| **ORM** | Prisma | 5 | Type-safe, auto-completion |
| **Auth** | jose (JWT) | 5 | Edge Runtime compatible |
| **Hashing** | bcryptjs | 2 | Password hashing |
| **Containerization** | Docker + Compose | latest | Portable deployment |

### 13.2 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint + Prettier** | Code quality + formatting |
| **Husky + lint-staged** | Pre-commit hooks |
| **Vitest** | Fast unit testing |
| **Playwright** | E2E testing (optional v2) |
| **TypeDoc** | API documentation |

---

## 14. Deployment Architecture

### 14.1 Production Setup (Recommended)

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   (DNS + CDN)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
    ┌─────────▼──────────┐      ┌──────────▼───────────┐
    │   Cloudflare Pages │      │       Vercel /        │
    │   or Vercel        │      │       Railway         │
    │                    │      │                       │
    │   Frontend (React) │      │  Backend (Next.js)    │
    │   Static files     │      │  API Routes           │
    │   Global CDN       │      │  Serverless/Node      │
    └────────────────────┘      └──────────┬────────────┘
                                           │
                                ┌──────────▼────────────┐
                                │    Neon / Supabase     │
                                │    PostgreSQL           │
                                │    Connection pooling   │
                                └────────────────────────┘
```

### 14.2 Platform Recommendations

| Platform | Use Case | Biaya |
|----------|----------|-------|
| **Vercel** | Frontend + Backend (hobby) | Free tier tersedia |
| **Railway** | Backend dedicated server | $5/bulan |
| **Cloudflare Pages** | Frontend static files | Free |
| **Neon** | PostgreSQL serverless | Free 0.5GB |
| **Supabase** | PostgreSQL + bonus features | Free 500MB |

### 14.3 Environment Variables

```bash
# backend/.env
DATABASE_URL="postgresql://user:password@host:5432/claratht"
JWT_SECRET="your-256-bit-secret-here"
JWT_EXPIRES_IN="8h"
ADMIN_DEFAULT_PASSWORD="change-me-in-production"
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW_MS=60000
CORS_ORIGINS="https://claratht.com,http://localhost:5173"
NODE_ENV="production"

# frontend/.env
VITE_API_URL="https://api.claratht.com"
VITE_APP_NAME="ClaraTHT"
VITE_APP_VERSION="1.0.0"
```

### 14.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy ClaraTHT

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Run CF Engine tests
        run: cd backend && npm ci && npx vitest run

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway/Vercel
        # ... platform-specific deployment steps

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel/Cloudflare Pages
        # ... platform-specific deployment steps
```

---

## 15. Future Scalability

### 15.1 v2.0 — Enhanced Expert System

**Timeline: 3-6 bulan setelah v1.0**

- **Penyakit lebih banyak**: Expand dari 5 ke 15+ penyakit THT (G015-G024 yang belum digunakan optimal)
- **Multiple Experts**: Bobot pakar dari beberapa dokter THT, rata-rata weighted
- **Rule Versioning**: Snapshot knowledge base per versi, rollback capability
- **Metode Perbandingan**: Tambah Dempster-Shafer sebagai alternatif — user bisa pilih metode
- **Confidence Calibration**: Kalibrasi ulang bobot berdasarkan feedback outcome nyata

### 15.2 v3.0 — AI/ML Integration

**Timeline: 6-12 bulan**

```
ML Enhancement Roadmap:
─────────────────────────────────────────────────────
① Collect anonymized consultation data (10k+ sessions)
② Train ML model to predict additional diagnostic clues
③ Hybrid inference: CF + ML ensemble
④ Symptom suggestion: "User dengan profil ini sering juga memilih..."
⑤ Risk scoring: probabilitas perlu segera ke dokter
```

**Technical approach:**
- Python ML service (FastAPI) running alongside Next.js
- scikit-learn / LightGBM for initial model
- Feature engineering dari symptom co-occurrence patterns
- Model served via REST endpoint called by CF engine

### 15.3 v4.0 — Conversational Interface

**Timeline: 12-18 bulan**

```
Chatbot Diagnosis Mode:
─────────────────────────────────────────────────────
User: "Telinga saya sakit dan ada dengungnya sejak 3 hari"
Bot:  "Baik, saya akan tanyakan beberapa gejala untuk membantu..."
Bot:  "Apakah ada riwayat mengorek telinga baru-baru ini?"
User: "Iya, kemarin"
Bot:  "Apakah pendengarannya juga berkurang?"
...
[Setelah 5-8 pertanyaan adaptif]
Bot:  "Berdasarkan gejala yang Anda ceritakan, ada kemungkinan..."
```

**Technical approach:**
- Adaptive questioning: tanya gejala berdasarkan prior probability
- LLM integration (Claude API / Gemini) untuk natural language understanding
- Map NL responses ke symptom codes
- CF engine tetap sebagai core inference

### 15.4 v5.0 — Healthcare Platform

**Timeline: 18+ bulan**

- **Telemedicine Integration**: Connect ke platform dokter online
- **EHR Lite**: Simpan riwayat medis sederhana per user (dengan akun)
- **Doctor Dashboard**: Dokter bisa lihat pasien yang sudah pre-diagnosis
- **Multi-Specialty**: Expand ke spesialitas lain (Mata, Kulit, Gigi)
- **API as a Service**: License CF engine ke klinik/rumah sakit
- **Mobile App**: React Native untuk iOS/Android

### 15.5 Technical Scalability

```
Database Scaling:
- Read replicas untuk analytics queries
- Connection pooling dengan PgBouncer
- Partitioning tabel ConsultationSession by month

API Scaling:
- Next.js edge functions untuk latency rendah
- Redis caching untuk symptom/disease data
- Rate limiting per user (authenticated) vs per IP (anonymous)

Frontend Scaling:
- Code splitting per route
- Service Worker untuk offline capability
- CDN untuk static assets

Monitoring (v1.0+):
- Sentry untuk error tracking
- Vercel Analytics atau Posthog untuk user analytics
- Uptime monitoring via Better Uptime
```

---

## Appendix: Quick Reference

### CF Weight Meanings

| Bobot | Arti | Contoh Penggunaan |
|-------|------|-------------------|
| 1.0 | Pathognomonic — gejala ini hampir pasti menandakan penyakit | Telinga nyeri → OMA |
| 0.8 | Sangat diagnostik | Batuk + demam → OMA |
| 0.6 | Cukup diagnostik | Pendengaran berkurang → OMA |
| 0.4 | Kurang spesifik | Sakit kepala → OMA |
| 0.2 | Sangat non-spesifik | Telinga gatal → Serumen |

### Confidence Level Guide

| CF Value | Level | Label | Warna |
|----------|-------|-------|-------|
| ≥ 0.80 | Very High | SANGAT TINGGI | Emerald |
| 0.60 – 0.79 | High | TINGGI | Blue |
| 0.40 – 0.59 | Medium | CUKUP | Amber |
| 0.10 – 0.39 | Low | RENDAH | Red |
| < 0.10 | — | (tidak ditampilkan) | — |

### Mandatory Disclaimer Text

```
⚠ PERHATIAN PENTING

Hasil dari ClaraTHT bersifat informatif dan merupakan pra-diagnosis
berbasis sistem pakar. Hasil ini TIDAK menggantikan diagnosis dokter
spesialis THT. Sistem ini menggunakan metode Certainty Factor berbasis
pengetahuan dari dr. M. Agus Sugicharto Sp.THT.

Segera konsultasikan ke dokter spesialis THT untuk mendapatkan
diagnosis dan penanganan yang tepat.
```

---

> **Referensi Ilmiah:** Setyaputri, K.E., Fadlil, A., & Sunardi. (2018). *Analisis Metode Certainty Factor pada Sistem Pakar Diagnosa Penyakit THT.* Jurnal Teknik Elektro Vol. 10 No. 1, hal. 30–35. Universitas Ahmad Dahlan, Yogyakarta. P-ISSN 1411-0059, E-ISSN 2549-1571.
>
> **Sumber Expert:** dr. M. Agus Sugicharto Sp.THT — Data rekam medis periode Februari 2018.

---

*ClaraTHT PRD v2.0 — Explainable AI Assisted Expert System*
*Modern · Production-Ready · Portfolio-Quality*
