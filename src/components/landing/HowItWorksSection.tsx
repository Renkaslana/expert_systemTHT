import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ClipboardList, GitBranch, ScanSearch } from 'lucide-react'
import { CFChip } from './primitives/CFChip'
import { ContributionBar } from './primitives/ContributionBar'
import { SectionHeader } from './SectionHeader'

// ─────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '01',
    icon: ClipboardList,
    accent: '#38BDF8',
    accentDim: 'rgba(56,189,248,0.12)',
    title: 'Symptom Intake',
    caption: 'Deklarasikan gejala dan tingkat keyakinan Anda.',
    body: 'Pilih dari 24 gejala THT terverifikasi. Setiap gejala dibobot 0.2 (ragu-ragu) sampai 1.0 (pasti) — sistem tahu seberapa yakin Anda, bukan sekadar ya/tidak.',
    imageSrc: '/img-intake.png',
    imageAlt: 'Pasien memilih gejala pada sistem Diagnova',
    overlay: 'intake' as const,
  },
  {
    n: '02',
    icon: GitBranch,
    accent: '#A78BFA',
    accentDim: 'rgba(167,139,250,0.12)',
    title: 'CF Inference',
    caption: 'Forward-chaining atas rule base ENT yang dikurasi pakar.',
    body: 'Bobot user dikalikan bobot pakar tiap aturan, lalu dikombinasikan iteratif menggunakan rumus MYCIN Certainty Factor. Setiap angka punya jejak yang dapat diaudit.',
    imageSrc: '/img-infer.png',
    imageAlt: 'Sistem CF reasoning menghitung diagnosis ENT secara real-time',
    overlay: 'inference' as const,
  },
  {
    n: '03',
    icon: ScanSearch,
    accent: '#34D399',
    accentDim: 'rgba(52,211,153,0.12)',
    title: 'Explainable Result',
    caption: 'Setiap persen kepercayaan ditelusuri ke gejala dan aturan.',
    body: 'Hasil bukan satu angka tunggal. Diagnova menampilkan kontribusi tiap gejala, aturan yang aktif, dan sumber pakar — sampai ke akar penalaran klinis.',
    imageSrc: '/img-explain.png',
    imageAlt: 'Dokter menjelaskan hasil diagnosis yang dapat ditelusuri kepada pasien',
    overlay: 'explanation' as const,
  },
]

// ─────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────
export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background:
          'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
      }}
    >
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 medical-grid opacity-40 dark:opacity-30" aria-hidden />

      <div className="container relative">
        <SectionHeader
          eyebrow="Diagnostic Pipeline · Cara Kerja"
          align="left"
          title={
            <span className="text-ink dark:text-white">
              Tiga stasiun,{' '}
              <span className="italic text-gradient-cool">
                satu pemahaman utuh.
              </span>
            </span>
          }
          subtitle="Dari pasien menjelaskan gejala, sampai sistem menjelaskan kembali diagnosis — setiap langkah terlihat dan dapat ditelusuri."
          className="!max-w-3xl dark:[&_p]:!text-slate-400"
        />

        <div className="editorial-hairline mt-10 dark:editorial-hairline-dark" />

        {/* ── Three-step grid ── */}
        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <StepCard
              key={s.n}
              step={s}
              index={i}
              isActive={activeStep === i}
              onHover={() => setActiveStep(i)}
            />
          ))}
        </div>

        {/* ── Process connector (desktop) ── */}
        <div className="mt-10 hidden items-center gap-0 lg:flex">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex flex-1 items-center">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-semibold"
                style={{
                  borderColor: activeStep === i ? s.accent : 'rgba(148,163,184,0.3)',
                  color: activeStep === i ? s.accent : '#64748B',
                  background: activeStep === i ? `${s.accent}15` : 'transparent',
                  transition: 'all 0.3s',
                }}
              >
                {s.n}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px flex-1 transition-all duration-500"
                  style={{
                    background:
                      activeStep > i
                        ? `linear-gradient(to right, ${STEPS[i].accent}, ${STEPS[i + 1].accent})`
                        : 'rgba(148,163,184,0.2)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-10 max-w-2xl font-mono text-[11px] text-ink-soft dark:text-slate-600">
          Forward-chaining engine berbasis Certainty Factor (Shortliffe · Stanford, 1976).
          Bobot pakar dikalibrasi oleh dr. M. Agus Sugicharto, Sp.THT-KL.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Step Card
// ─────────────────────────────────────────────────────────────────────
function StepCard({
  step,
  index,
  isActive,
  onHover,
}: {
  step: (typeof STEPS)[number]
  index: number
  isActive: boolean
  onHover: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 ${
        isActive ? 'shadow-[0_32px_80px_-30px_rgba(0,0,0,0.45)]' : ''
      }`}
      style={{
        border: `1px solid ${isActive ? step.accent + '40' : 'rgba(148,163,184,0.2)'}`,
        background: isActive
          ? `linear-gradient(160deg, ${step.accentDim} 0%, hsl(var(--card)) 100%)`
          : 'hsl(var(--card))',
        boxShadow: isActive
          ? `0 1px 0 0 rgba(255,255,255,0.7) inset, 0 32px 80px -32px rgba(0,0,0,0.35), 0 0 0 1px ${step.accent}20`
          : '0 1px 0 0 rgba(255,255,255,0.6) inset, 0 14px 32px -20px rgba(15,23,42,0.16)',
        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Photo with parallax */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <motion.img
          src={step.imageSrc}
          alt={step.imageAlt}
          className="h-full w-full object-cover"
          style={{ scale: imgScale }}
          loading="lazy"
          decoding="async"
        />
        {/* gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(5,8,20,0.6) 0%, rgba(5,8,20,0.08) 40%, rgba(5,8,20,0.0) 100%)',
          }}
          aria-hidden
        />
        {/* Active accent glow */}
        {isActive && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(80% 80% at 50% 100%, ${step.accent}25 0%, transparent 70%)`,
            }}
            aria-hidden
          />
        )}

        {/* Top-left station badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/90 backdrop-blur-md"
          >
            <step.icon className="h-3.5 w-3.5" style={{ color: step.accent }} />
          </span>
          <span
            className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur-md"
            style={{
              color: step.accent,
              background: 'rgba(255,255,255,0.92)',
              borderColor: `${step.accent}40`,
            }}
          >
            {step.n} · {step.title}
          </span>
        </div>

        {/* Overlay UI mock */}
        <div className="absolute inset-x-3 bottom-3">
          <StepOverlay variant={step.overlay} accent={step.accent} />
        </div>
      </div>

      {/* Copy section */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="font-display text-[22px] font-medium leading-tight text-ink dark:text-white"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 80' }}
        >
          {step.title}
        </h3>
        <p
          className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: step.accent }}
        >
          {step.caption}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-slate-400">
          {step.body}
        </p>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Overlay UI Mocks
// ─────────────────────────────────────────────────────────────────────
function StepOverlay({
  variant,
  accent,
}: {
  variant: 'intake' | 'inference' | 'explanation'
  accent: string
}) {
  const base =
    'rounded-2xl border border-white/20 bg-[rgba(4,7,18,0.82)] p-3 backdrop-blur-xl shadow-[0_16px_40px_-20px_rgba(0,0,0,0.65)]'

  if (variant === 'intake') {
    return (
      <div className={base}>
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-mono uppercase tracking-[0.2em] text-slate-500">Symptom intake</span>
          <span className="num font-mono text-emerald-300">3 / 24</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <CFChip code="G020" label="Nyeri telinga" cf={0.8} />
          <CFChip code="G004" label="Demam" cf={0.6} />
        </div>
      </div>
    )
  }
  if (variant === 'inference') {
    return (
      <div className={base}>
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-mono uppercase tracking-[0.2em] text-slate-500">CF combination</span>
          <span className="font-mono" style={{ color: accent }}>R007</span>
        </div>
        <pre className="mt-1.5 whitespace-pre-wrap font-mono text-[9px] leading-relaxed text-slate-200">
{`cf₁ = 0.80·1.00 = 0.80
cf₂ = 0.60·0.80 = 0.48
CF  = cf₁ + cf₂·(1-cf₁) = 0.896`}
        </pre>
      </div>
    )
  }
  return (
    <div className={`${base} space-y-1.5`}>
      <div className="flex items-center justify-between text-[9px]">
        <span className="font-mono uppercase tracking-[0.2em] text-slate-500">Top contributions</span>
        <span className="num font-mono text-emerald-300">CF 0.78</span>
      </div>
      <ContributionBar code="G020" label="Nyeri telinga" value={0.42} highlighted />
      <ContributionBar code="G023" label="Tinnitus" value={0.21} delay={0.06} />
    </div>
  )
}
