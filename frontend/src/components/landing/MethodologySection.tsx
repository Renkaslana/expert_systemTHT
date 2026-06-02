import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, FileText, Quote, Stethoscope } from 'lucide-react'
import { SmartImage } from './primitives/SmartImage'
import { IMG } from '@/data/landingImages'

// ─────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '01',
    icon: Stethoscope,
    accent: '#38BDF8',
    title: 'Knowledge acquisition',
    body: 'Wawancara langsung dengan dokter spesialis THT-KL dan studi literatur peer-reviewed untuk merekonstruksi pohon penalaran klinis.',
    image: IMG.methodResearch,
  },
  {
    n: '02',
    icon: FileText,
    accent: '#A78BFA',
    title: 'Rule curation',
    body: 'Setiap aturan inferensi dibuat dalam bentuk IF–THEN dengan kondisi gejala spesifik dan konsekuensi penyakit ICD-10.',
    image: IMG.methodNotes,
  },
  {
    n: '03',
    icon: BookOpen,
    accent: '#F59E0B',
    title: 'CF calibration',
    body: 'Bobot pakar (0.0–1.0) diturunkan dari skala lima titik literatur klasik dan disetel ulang per aturan oleh konsultan klinis.',
    image: IMG.methodBooks,
  },
  {
    n: '04',
    icon: FileText,
    accent: '#34D399',
    title: 'Clinical review',
    body: 'Hasil divalidasi terhadap 50+ skenario gejala dan dievaluasi dengan rubrik ketepatan diagnostik THT internal.',
    image: IMG.methodReview,
  },
]

const CITATIONS = [
  {
    text: 'Setyaputri, K.E., Fadlil, A., & Sunardi (2018) — Sistem Pakar Diagnosa Penyakit THT.',
    where: 'Jurnal Teknik Elektro Vol. 10 No. 1',
    accent: '#38BDF8',
  },
  {
    text: 'Buku Saku Pelayanan Kesehatan Telinga, Hidung, dan Tenggorokan.',
    where: 'Kemenkes RI · Direktorat Bina Upaya Kesehatan',
    accent: '#A78BFA',
  },
  {
    text: 'WHO ICD-10 — H60–H95 (Ear), J00–J39 (Respiratory).',
    where: 'World Health Organization · 2019 revision',
    accent: '#F59E0B',
  },
  {
    text: 'Shortliffe, E. H. (1976) — Computer-based medical consultations: MYCIN.',
    where: 'American Elsevier — origin of CF combination',
    accent: '#34D399',
  },
]

const REVIEWERS = [
  { initials: 'AS', role: 'Konsultan klinis', sub: 'dr. M. Agus Sugicharto · Sp.THT-KL', color: 'bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300' },
  { initials: 'KE', role: 'Metodologi sistem pakar', sub: 'Setyaputri · Fadlil · Sunardi (2018)', color: 'bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300' },
  { initials: 'EH', role: 'CF framework', sub: 'Shortliffe · Stanford 1976', color: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300' },
  { initials: 'JR', role: 'Frontend & UX', sub: 'Diagnova design team', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' },
] as const

// ─────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────
export function MethodologySection() {
  return (
    <section
      id="methodology"
      className="cv-auto relative overflow-hidden py-28 md:py-36"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
      }}
    >
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 medical-grid opacity-40 dark:opacity-25" aria-hidden />

      <div className="container relative">

        {/* ── Header ── */}
        <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Methodology · About
            </span>
            <h2
              className="mt-5 font-display font-medium leading-[1.04] tracking-tight text-ink dark:text-white"
              style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
            >
              How the{' '}
              <span className="italic text-gradient-cool">
                knowledge
              </span>{' '}
              was built.
            </h2>
            <p className="mt-5 max-w-xl text-ink-soft dark:text-slate-400">
              Diagnova bukan model bahasa yang dilatih atas miliaran token. Aturan, gejala, dan
              bobot CF disusun manual oleh tim klinis dan ditelusuri kembali ke sumber literatur
              — supaya setiap diagnosis bisa dipertanggungjawabkan.
            </p>
          </div>

          <div className="flex md:justify-end">
            <Link
              to="/tentang"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-primary/60 hover:text-primary dark:text-slate-400 dark:hover:text-sky-400"
            >
              Read full methodology
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="editorial-hairline mt-10" />

        {/* ── 4-step magazine grid ── */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <StepArticle key={s.n} step={s} index={i} />
          ))}
        </div>

        {/* ── Evidence + reviewers ── */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Evidence card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7"
            style={{
              boxShadow: '0 1px 0 0 rgba(255,255,255,0.7) inset, 0 24px 60px -30px rgba(15,23,42,0.16) dark:0 24px 60px -30px rgba(0,0,0,0.45)',
            }}
          >
            {/* Corner accent */}
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[60px] bg-gradient-to-bl from-sky-400/8 to-transparent dark:from-sky-400/5" aria-hidden />

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <FileText className="h-3 w-3" />
                Evidence card · R007
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">v0.1 · 2025</span>
            </div>

            <pre className="mt-5 whitespace-pre-wrap rounded-xl border border-border/60 bg-muted/50 p-4 font-mono text-[11px] leading-relaxed text-ink dark:text-slate-200">
{`RULE R007
  IF   G020 (Nyeri Telinga,  CF user · 0.80)
   ∧   G016 (Telinga berair, CF user · 0.60)
  THEN P001 (Otitis Media Akut, CF expert · 0.85)

cf₁ = user · expert    = 0.80 · 1.00 = 0.80
cf₂ = user · expert    = 0.60 · 0.80 = 0.48
CF  = cf₁ + cf₂·(1-cf₁) = 0.896`}
            </pre>

            <div className="mt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Cited references
              </p>
              <ul className="mt-2.5 space-y-2">
                {CITATIONS.map((c) => (
                  <li
                    key={c.text}
                    className="flex gap-3 border-b border-border/50 pb-2 text-[12px] leading-relaxed last:border-0 last:pb-0"
                  >
                    <Quote className="mt-0.5 h-3 w-3 shrink-0" style={{ color: c.accent }} />
                    <span>
                      <span className="text-ink dark:text-slate-200">{c.text}</span>
                      <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                        {c.where}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: photo collage + reviewers */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <PhotoTile slot={IMG.methodResearch} />
              <PhotoTile slot={IMG.methodReview} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-3xl border border-border/60 bg-card p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Reviewers & contributors
              </p>
              <ul className="mt-3.5 space-y-3">
                {REVIEWERS.map((r, i) => (
                  <motion.li
                    key={r.initials}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${r.color}`}
                    >
                      {r.initials}
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-[13px] font-medium text-ink dark:text-slate-200">
                        {r.role}
                      </p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        {r.sub}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Step article card
// ─────────────────────────────────────────────────────────────────────
function StepArticle({
  step,
  index,
}: {
  step: (typeof STEPS)[number]
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] dark:hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
      style={{
        boxShadow: '0 1px 0 0 rgba(255,255,255,0.75) inset, 0 10px 28px -18px rgba(15,23,42,0.16)',
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <SmartImage
            src={step.image.src}
            alt={step.image.alt}
            region={step.image.region}
            imgClassName="h-full w-full object-cover"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(5,8,20,0.55) 0%, rgba(5,8,20,0.0) 50%)',
          }}
          aria-hidden
        />
        {/* Step number badge */}
        <span className="num absolute right-3 top-3 rounded-full border border-white/25 bg-white/92 px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] text-ink backdrop-blur-md">
          {step.n} / 04
        </span>
        {/* Icon badge */}
        <span
          className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-xl border border-white/25 bg-white/92 backdrop-blur-md"
        >
          <step.icon className="h-4 w-4" style={{ color: step.accent }} />
        </span>
      </div>
      <div className="p-5">
        <h3
          className="font-display text-[21px] font-medium italic leading-snug text-ink dark:text-white"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 80' }}
        >
          {step.title}
        </h3>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-soft dark:text-slate-400">
          {step.body}
        </p>
      </div>
    </motion.article>
  )
}

function PhotoTile({ slot }: { slot: { src: string; alt: string; region: string } }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60">
      <SmartImage
        src={slot.src}
        alt={slot.alt}
        region={slot.region as 'ear' | 'sinus' | 'throat' | 'workspace' | 'research'}
        imgClassName="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,8,20,0.35) 0%, transparent 60%)',
        }}
        aria-hidden
      />
    </div>
  )
}
