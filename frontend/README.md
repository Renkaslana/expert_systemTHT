# Diagnova — Frontend

Vite + React 18 + TypeScript + Tailwind + Framer Motion. UI untuk
konsultasi dan visualisasi hasil diagnosis dari Diagnova expert system.

Untuk panduan **setup lengkap**, **arsitektur**, dan **dokumentasi
project**, lihat:

- 📘 **[README utama](../README.md)** — pintu masuk project
- 🏛 **[docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)** — arsitektur sistem
- ⚙️ **[docs/SETUP.md](../docs/SETUP.md)** — panduan setup detail
- 🔌 **[docs/backend/FRONTEND_INTEGRATION.md](../docs/backend/FRONTEND_INTEGRATION.md)** — integrasi frontend ↔ backend

---

## Quick Reference

### Scripts

```bash
npm run dev         # Vite dev server → http://localhost:5173
npm run build       # Production build → dist/
npm run preview     # Preview production build locally
npx tsc --noEmit    # TypeScript check (no script alias yet)
```

### Stack

| Layer | Teknologi |
|---|---|
| Framework | React 18.3 + TypeScript 5.6 |
| Bundler | Vite 5.4 |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate |
| Animation | Framer Motion 11 |
| State | Zustand 5 |
| Routing | React Router 6.28 |
| Icons | Lucide React |

### Struktur

```
src/
├── app/             # App.tsx, Router, Providers
├── pages/           # 7 routes (Landing, Konsultasi, Hasil, dll)
├── components/
│   ├── landing/     # Section hero, KB, dll
│   ├── consultation/# Region picker, symptom card, ProcessingAnimation
│   ├── result/      # DiagnosisCard, CFConfidenceMeter, dll
│   ├── shared/      # Navbar, Footer, PageShell
│   ├── visuals/     # Anatomy, Soundwave, MiniConfidenceRing
│   └── ui/          # Button, Card, Badge primitives
├── lib/
│   ├── api.ts              # Generic fetch wrapper + ApiError
│   ├── diagnova-api.ts     # Typed endpoint functions
│   └── utils.ts            # cn(), CF utilities
├── data/            # Frontend reference data (bundled copy of backend KB)
├── stores/          # Zustand stores
└── types/           # TypeScript types matching backend DTOs
```

### Environment

`.env.local` (auto-loaded by Vite, gitignored):

```env
VITE_API_URL=http://localhost:3001/api/v1
```

### Hot reload

- Edit `src/**/*.tsx` → Vite HMR instant
- Edit `tailwind.config.ts` → restart needed
- Edit `vite.config.ts` → restart needed

---

## Catatan untuk developer

### Reference data vs Mock data

`src/data/symptoms.ts` dan `src/data/diseases.ts` adalah **frontend
reference data** — bundled copy dari knowledge base backend untuk:
- Performa landing page (instant render tanpa fetch)
- UI metadata yang tidak diexpose API (`SYMPTOM_CATEGORIES`)
- Lookup `SYMPTOM_BY_CODE` di komponen seperti RegionHeatmap

**Bukan mock data.** Diagnosis real selalu via backend `POST /diagnose`.

File `src/data/mockDiagnosis.ts` **sudah dihapus** sejak Fase 6 — engine
diagnosis sepenuhnya backend.

### API client pattern

Component **tidak boleh** panggil `fetch()` langsung:

```typescript
// ❌ Jangan
const response = await fetch('http://localhost:3001/api/v1/diagnose', ...)

// ✅ Pakai typed API
import { diagnose } from '@/lib/diagnova-api'
const result = await diagnose({ symptoms })
```

Ini memastikan type-safety + error handling konsisten via `ApiError` class.

### Loading + Error pattern

```typescript
const [loading, setLoading] = useState(true)
const [data, setData] = useState<T | null>(null)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const controller = new AbortController()
  getThing({ signal: controller.signal })
    .then(setData)
    .catch((err) => {
      if (err?.name === 'AbortError') return
      setError(humanMessage(err))
    })
    .finally(() => setLoading(false))
  return () => controller.abort()
}, [])
```

AbortController cancel request saat unmount → avoid memory leak + race conditions.

---

## Lihat juga

- Backend API endpoints: [docs/backend/API.md](../docs/backend/API.md)
- Database schema: [docs/backend/SCHEMA.md](../docs/backend/SCHEMA.md)
- CF Engine: [docs/backend/CF_ENGINE.md](../docs/backend/CF_ENGINE.md)
