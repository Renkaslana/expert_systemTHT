# Diagnova — Frontend Prototype

> *Where Symptoms Become Clarity.*

Prototype UI **frontend-only** untuk **Diagnova** — platform *Explainable Medical Intelligence* untuk diagnosis pre-konsultasi penyakit Telinga, Hidung, dan Tenggorokan (THT). Tahap ini fokus mengunci **visual design**, **user experience**, dan **consultation flow** sebelum backend / inference engine dibangun.

> Tidak ada backend, database, auth, Prisma, API, atau implementasi Certainty Factor sungguhan. Semua diagnosis dihasilkan dari modul **mock** di `src/data/mockDiagnosis.ts`.

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 (+ tailwindcss-animate)
- Framer Motion
- Zustand (consultation + theme stores)
- React Router 6
- shadcn/ui-style primitives (button, card, badge, tooltip, segmented)
- Lucide icons

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173.

## Struktur

```
src/
├── app/                 # App.tsx wrapper, Router, Providers (theme)
├── pages/               # Landing, Consultation, Result, Disease List/Detail, About, 404
├── components/
│   ├── shared/          # Navbar, Footer, ThemeToggle, MedicalDisclaimer, Logo, PageShell
│   ├── consultation/    # Stepper, BodyAreaFilter, SymptomCard, ProcessingAnimation
│   ├── result/          # DiagnosisCard, CFConfidenceMeter, ContributionChart, Explainability
│   └── ui/              # Primitif: Button, Card, Badge, Tooltip, Segmented
├── data/                # symptoms.ts, diseases.ts, mockDiagnosis.ts
├── stores/              # consultationStore, themeStore (Zustand)
├── lib/                 # utils.ts (cn, CF_WEIGHT_OPTIONS, confidence colors)
└── types/               # tipe-tipe domain
```

## Halaman

| Route | Tujuan |
| --- | --- |
| `/` | Landing page — hero + how-it-works + disease overview + trust strip |
| `/konsultasi` | Pilih area, tandai gejala (5 level keyakinan), proses analisis |
| `/hasil` | Diagnosis utama + kandidat sekunder + Explainability Panel |
| `/penyakit` | Grid 5 penyakit dalam knowledge base |
| `/penyakit/:id` | Tabbed detail penyakit + sidebar "kapan ke dokter" + related |
| `/tentang` | Penjelasan metodologi & sumber pakar |

## Catatan Desain

- **Glassmorphism subtle** via utility `glass` / `glass-strong` di `index.css`.
- **Dark mode** persist di localStorage; default mengikuti `prefers-color-scheme`.
- **Animation** smooth 200–400 ms (entry, stagger, layout). CF Meter pakai spring-style ease.
- **Mobile responsive**: floating action bar, grid breakpoints sm/md/lg.
- Komponen UI dibuat ringan (tidak mem-bundle dependency shadcn radix penuh) supaya prototype mudah di-tweak.

## Selanjutnya (di luar scope tahap ini)

- Backend Next.js + Prisma + PostgreSQL.
- Real CF Engine (`backend/lib/cfEngine.ts`) sesuai PRD §8.
- Admin dashboard, analytics, audit log.
- Riwayat tersimpan, share link, ekspor PDF.
