import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ClipboardList,
  GitBranch,
  ScanSearch,
  FileInput,
  Network,
  Sparkles,
} from 'lucide-react'
import { CFChip } from './primitives/CFChip'
import { ContributionBar } from './primitives/ContributionBar'

// ─────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '01',
    icon: ClipboardList,
    accent: '#38BDF8',
    accentRgb: '56,189,248',
    accentDim: 'rgba(56,189,248,0.10)',
    title: 'Symptom Intake',
    caption: 'Deklarasikan gejala dan tingkat keyakinan Anda.',
    body: 'Pilih dari 24 gejala THT terverifikasi. Setiap gejala dibobot 0.2 (ragu-ragu) sampai 1.0 (pasti) — sistem tahu seberapa yakin Anda, bukan sekadar ya/tidak.',
    tagline: 'Input terstruktur',
    taglineIcon: FileInput,
    imageSrc: '/img-intake.png',
    imageAlt: 'Pasien memilih gejala pada sistem Diagnova',
    overlay: 'intake' as const,
  },
  {
    n: '02',
    icon: GitBranch,
    accent: '#A78BFA',
    accentRgb: '167,139,250',
    accentDim: 'rgba(167,139,250,0.10)',
    title: 'CF Inference',
    caption: 'Forward-chaining atas rule base ENT yang dikurasi pakar.',
    body: 'Bobot user dikalikan bobot pakar tiap aturan, lalu dikombinasikan iteratif menggunakan rumus MYCIN Certainty Factor. Setiap angka punya jejak yang dapat diaudit.',
    tagline: 'Reasoning transparan',
    taglineIcon: Network,
    imageSrc: '/img-infer.png',
    imageAlt: 'Sistem CF reasoning menghitung diagnosis ENT secara real-time',
    overlay: 'inference' as const,
  },
  {
    n: '03',
    icon: ScanSearch,
    accent: '#34D399',
    accentRgb: '52,211,153',
    accentDim: 'rgba(52,211,153,0.10)',
    title: 'Explainable Result',
    caption: 'Setiap persen kepercayaan ditelusuri ke gejala dan aturan.',
    body: 'Hasil bukan satu angka tunggal. Diagnova menampilkan kontribusi tiap gejala, aturan yang aktif, dan sumber pakar — sampai ke akar penalaran klinis.',
    tagline: 'Hasil dapat dijelaskan',
    taglineIcon: Sparkles,
    imageSrc: '/img-explain.png',
    imageAlt: 'Dokter menjelaskan hasil diagnosis yang dapat ditelusuri kepada pasien',
    overlay: 'explanation' as const,
  },
]

// ─────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────
export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1) // Center is focal by default

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background:
          'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          BACKGROUND DECOR — topology, radial bloom, micro-grid
      ═══════════════════════════════════════════════════════════════ */}
      <BackgroundDecor />

      <div className="container relative">
        {/* ═════════════════════════════════════════════════════════════
            HEADER ROW — title left, workflow pipeline right (lg+)
        ═════════════════════════════════════════════════════════════ */}
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Title block */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="lg:col-span-5"
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-sky-400/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              </span>
              Diagnostic Pipeline · Cara Kerja
            </motion.span>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="mt-6 font-display font-medium tracking-[-0.025em] text-balance text-[clamp(34px,4.2vw,56px)] leading-[0.98] text-slate-900 dark:text-white"
              style={{ fontVariationSettings: '"opsz" 96, "SOFT" 60' }}
            >
              <span className="block">Tiga stasiun,</span>
              <span
                className="block italic font-normal bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(120deg, #38BDF8 0%, #A78BFA 50%, #34D399 100%)',
                  filter: 'drop-shadow(0 4px 24px rgba(167,139,250,0.20))',
                }}
              >
                satu pemahaman utuh.
              </span>
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="mt-5 max-w-[44ch] text-[1.02rem] leading-[1.7] text-slate-600 dark:text-slate-400"
            >
              Dari pasien menjelaskan gejala, sampai sistem menjelaskan kembali
              diagnosis — setiap langkah terlihat dan dapat ditelusuri.
            </motion.p>
          </motion.div>

          {/* Pipeline visualization */}
          <div className="lg:col-span-7">
            <PipelineNav
              activeStep={activeStep}
              onSelect={setActiveStep}
            />
          </div>
        </div>

        {/* Editorial hairline */}
        <div className="editorial-hairline mt-14 dark:editorial-hairline-dark" />

        {/* ═════════════════════════════════════════════════════════════
            CARDS — 3 columns, center elevated as focal point
        ═════════════════════════════════════════════════════════════ */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((s, i) => (
            <StepCard
              key={s.n}
              step={s}
              index={i}
              isActive={activeStep === i}
              isCenter={i === 1}
              onHover={() => setActiveStep(i)}
            />
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-14 max-w-2xl font-mono text-[11px] leading-relaxed text-slate-500 dark:text-slate-600">
          Forward-chaining engine berbasis Certainty Factor (Shortliffe ·
          Stanford, 1976). Bobot pakar dikalibrasi oleh dr. M. Agus Sugicharto,
          Sp.THT-KL.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Background decoration — topology + radial blooms + waveform
// ─────────────────────────────────────────────────────────────────────
function BackgroundDecor() {
  return (
    <>
      {/* Soft micro-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 medical-grid opacity-30 dark:opacity-20"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%)',
        }}
      />

      {/* Top-right cyan bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: '8%',
          top: '6%',
          width: 520,
          height: 420,
          background:
            'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.04) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Bottom-left violet bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: '4%',
          bottom: '10%',
          width: 480,
          height: 400,
          background:
            'radial-gradient(circle, rgba(167,139,250,0.14) 0%, rgba(167,139,250,0.04) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Decorative topology / waveform pattern (right side) */}
      <svg
        aria-hidden
        viewBox="0 0 800 600"
        className="pointer-events-none absolute right-0 top-1/4 hidden h-[60%] w-1/3 opacity-[0.35] dark:opacity-25 lg:block"
        fill="none"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id="topo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <g stroke="url(#topo-grad)" strokeWidth="0.6" strokeLinecap="round">
          <path d="M 0 100 C 200 100, 220 150, 400 150 C 600 150, 620 80, 800 80" opacity="0.6" />
          <path d="M 0 200 C 200 200, 220 260, 400 260 C 600 260, 620 200, 800 200" opacity="0.45" />
          <path d="M 0 300 C 200 300, 220 360, 400 360 C 600 360, 620 320, 800 320" opacity="0.5" />
          <path d="M 0 400 C 200 400, 220 450, 400 450 C 600 450, 620 420, 800 420" opacity="0.4" />
          <path d="M 0 500 C 200 500, 220 540, 400 540 C 600 540, 620 510, 800 510" opacity="0.35" />
        </g>
        {/* Network dots */}
        <g fill="url(#topo-grad)">
          <circle cx="180" cy="150" r="1.5" opacity="0.7" />
          <circle cx="420" cy="260" r="1.5" opacity="0.6" />
          <circle cx="640" cy="200" r="1.5" opacity="0.7" />
          <circle cx="240" cy="360" r="1.5" opacity="0.5" />
          <circle cx="560" cy="450" r="1.5" opacity="0.55" />
        </g>
      </svg>

      {/* Mirror waveform on left side, fainter */}
      <svg
        aria-hidden
        viewBox="0 0 800 600"
        className="pointer-events-none absolute left-0 top-1/3 hidden h-[50%] w-1/4 opacity-[0.22] dark:opacity-15 lg:block"
        fill="none"
        preserveAspectRatio="xMinYMid slice"
      >
        <g stroke="currentColor" strokeWidth="0.5" className="text-sky-400">
          <path d="M 0 80 C 150 80, 170 130, 350 130" opacity="0.5" />
          <path d="M 0 200 C 150 200, 170 260, 350 260" opacity="0.4" />
          <path d="M 0 320 C 150 320, 170 380, 350 380" opacity="0.45" />
          <path d="M 0 440 C 150 440, 170 490, 350 490" opacity="0.35" />
        </g>
      </svg>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Pipeline Nav — connected workflow visualization
// ─────────────────────────────────────────────────────────────────────
function PipelineNav({
  activeStep,
  onSelect,
}: {
  activeStep: number
  onSelect: (i: number) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative h-[140px] w-full"
    >
      {/* SVG: connector path + decorative branches + animated pulse */}
      <svg
        viewBox="0 0 800 140"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="pipe-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="pipe-grad-faint" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="pulse-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Decorative background paths — subtle branches above/below main */}
        <g
          stroke="url(#pipe-grad-faint)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          strokeLinecap="round"
        >
          <path d="M 80 80 C 200 80 220 40 400 40" opacity="0.6" />
          <path d="M 80 80 C 200 80 220 110 400 110" opacity="0.5" />
          <path d="M 400 40 C 580 40 600 70 720 70" opacity="0.5" />
          <path d="M 400 110 C 580 110 600 90 720 70" opacity="0.5" />
          <path d="M 50 60 L 70 70" opacity="0.7" />
          <path d="M 50 100 L 70 90" opacity="0.7" />
          <path d="M 730 60 L 750 70" opacity="0.7" />
          <path d="M 730 90 L 750 80" opacity="0.7" />
        </g>

        {/* Main flowing connector */}
        <path
          d="M 80 70 C 220 70 240 50 400 70 C 560 90 580 70 720 70"
          stroke="url(#pipe-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outer glow on main path (rendered first, slightly larger) */}
        <path
          d="M 80 70 C 220 70 240 50 400 70 C 560 90 580 70 720 70"
          stroke="url(#pipe-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.22"
          style={{ filter: 'blur(6px)' }}
        />

        {/* Inner highlight stroke for crisp edge */}
        <path
          d="M 80 70 C 220 70 240 50 400 70 C 560 90 580 70 720 70"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.4"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Animated travelling pulse — primary (white core) */}
        <circle r="3.5" fill="white" opacity="0.95"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))' }}>
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M 80 70 C 220 70 240 50 400 70 C 560 90 580 70 720 70"
          />
        </circle>

        {/* Secondary pulse (offset, gradient-tinted) — feels like flowing data */}
        <circle r="2.5" fill="url(#pipe-grad)" opacity="0.85"
          style={{ filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.8))' }}>
          <animateMotion
            dur="4s"
            begin="2s"
            repeatCount="indefinite"
            path="M 80 70 C 220 70 240 50 400 70 C 560 90 580 70 720 70"
          />
        </circle>

        {/* Tertiary trailing pulse — small, faint */}
        <circle r="1.5" fill="rgba(255,255,255,0.7)" opacity="0.6">
          <animateMotion
            dur="4s"
            begin="0.8s"
            repeatCount="indefinite"
            path="M 80 70 C 220 70 240 50 400 70 C 560 90 580 70 720 70"
          />
        </circle>

        {/* Pulse halos at each node */}
        {STEPS.map((_, i) => {
          const cx = i === 0 ? 80 : i === 1 ? 400 : 720
          const isActive = activeStep === i
          return (
            <g key={i}>
              {/* Outer pulse ring (only if active) */}
              {isActive && (
                <motion.circle
                  cx={cx}
                  cy={70}
                  r={6}
                  fill="none"
                  stroke={STEPS[i].accent}
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0.7, 0, 0.7], scale: [1, 2.4, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${cx}px 70px` }}
                />
              )}
              {/* Outer glow disc */}
              <circle
                cx={cx}
                cy={70}
                r={isActive ? 14 : 10}
                fill={STEPS[i].accent}
                opacity={isActive ? 0.18 : 0.08}
                style={{ filter: 'blur(8px)' }}
              />
              {/* Solid node dot */}
              <circle
                cx={cx}
                cy={70}
                r={isActive ? 5.5 : 4}
                fill={STEPS[i].accent}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 8px ${STEPS[i].accent})`
                    : 'none',
                  transition: 'all 0.3s',
                }}
              />
              {/* Inner highlight */}
              <circle
                cx={cx - 1}
                cy={68}
                r={isActive ? 1.6 : 1.2}
                fill="rgba(255,255,255,0.85)"
              />
            </g>
          )
        })}
      </svg>

      {/* HTML labels overlay — positioned above the dots */}
      <div className="absolute inset-0 grid grid-cols-3">
        {STEPS.map((s, i) => {
          const isActive = activeStep === i
          return (
            <button
              key={s.n}
              type="button"
              onMouseEnter={() => onSelect(i)}
              onFocus={() => onSelect(i)}
              className="group relative flex flex-col items-center justify-start pt-2 transition-all"
            >
              {/* Number */}
              <span
                className="font-mono text-[11px] font-semibold tracking-[0.22em] transition-colors"
                style={{
                  color: isActive ? s.accent : 'rgba(100,116,139,0.7)',
                }}
              >
                {s.n}
              </span>
              {/* Label */}
              <span
                className={`mt-1 font-display text-[13px] font-medium transition-all ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-500'
                }`}
              >
                {s.title}
              </span>
              {/* Spacer where the dot sits in SVG (visual alignment) */}
              <span className="h-12" aria-hidden />
              {/* Tagline below dot */}
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.20em] transition-colors ${
                  isActive
                    ? 'opacity-100'
                    : 'opacity-50'
                }`}
                style={{ color: isActive ? s.accent : 'rgba(100,116,139,0.6)' }}
              >
                {s.tagline}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Step Card — center is elevated focal point
// ─────────────────────────────────────────────────────────────────────
function StepCard({
  step,
  index,
  isActive,
  isCenter,
  onHover,
}: {
  step: (typeof STEPS)[number]
  index: number
  isActive: boolean
  isCenter: boolean
  onHover: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06])

  const TaglineIcon = step.taglineIcon

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={onHover}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500"
      style={{
        border: `1px solid ${
          isActive || isCenter
            ? `rgba(${step.accentRgb},0.30)`
            : 'rgba(148,163,184,0.18)'
        }`,
        background: isCenter
          ? `linear-gradient(165deg, ${step.accentDim} 0%, hsl(var(--card)) 50%, hsl(var(--card)) 100%)`
          : 'hsl(var(--card))',
        // Center elevation conveyed PURELY via shadow + glow, NOT positional offset.
        // All cards stay the same height & baseline.
        boxShadow: isCenter
          ? `0 1px 0 0 rgba(255,255,255,0.85) inset,` +
            `0 40px 90px -30px rgba(${step.accentRgb},0.40),` +
            `0 18px 36px -16px rgba(15,23,42,0.20),` +
            `0 0 0 1px rgba(${step.accentRgb},0.18),` +
            `0 0 60px -10px rgba(${step.accentRgb},0.18)`
          : isActive
          ? `0 1px 0 0 rgba(255,255,255,0.7) inset,` +
            `0 24px 48px -24px rgba(${step.accentRgb},0.22),` +
            `0 8px 20px -10px rgba(15,23,42,0.12)`
          : '0 1px 0 0 rgba(255,255,255,0.6) inset, 0 14px 32px -20px rgba(15,23,42,0.16)',
      }}
    >
      {/* Top accent hairline (only on center) */}
      {isCenter && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${step.accent}, transparent)`,
          }}
        />
      )}

      {/* Image area with parallax */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <motion.img
          src={step.imageSrc}
          alt={step.imageAlt}
          className="h-full w-full object-cover"
          style={{ scale: imgScale }}
          loading="lazy"
          decoding="async"
        />
        {/* Lighter gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(5,8,20,0.55) 0%, rgba(5,8,20,0.05) 45%, rgba(5,8,20,0) 100%)',
          }}
          aria-hidden
        />
        {/* Active accent glow */}
        {(isActive || isCenter) && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(80% 80% at 50% 100%, rgba(${step.accentRgb},0.22) 0%, transparent 70%)`,
            }}
            aria-hidden
          />
        )}

        {/* Top-left badge */}
        <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.85)',
              borderColor: `rgba(${step.accentRgb},0.30)`,
            }}
          >
            <step.icon
              className="h-3.5 w-3.5"
              style={{ color: step.accent }}
            />
          </span>
          <span
            className="rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.20em] backdrop-blur-md"
            style={{
              color: step.accent,
              background: 'rgba(255,255,255,0.92)',
              borderColor: `rgba(${step.accentRgb},0.35)`,
            }}
          >
            {step.n} · {step.title}
          </span>
        </div>

        {/* Floating overlay panel — lighter, smaller */}
        <div className="absolute inset-x-3 bottom-3">
          <StepOverlay variant={step.overlay} accent={step.accent} />
        </div>
      </div>

      {/* Copy section — flex-1 so all cards share the same total height */}
      <div className="flex flex-1 flex-col p-6 pb-5">
        <h3
          className="font-display text-[22px] font-medium leading-tight text-slate-900 dark:text-white"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 80' }}
        >
          {step.title}
        </h3>
        <p
          className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: step.accent }}
        >
          {step.caption}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
          {step.body}
        </p>
      </div>

      {/* Footer tagline — fixed height across all cards */}
      <div
        className="mt-auto flex h-[52px] items-center gap-2 border-t px-6"
        style={{
          borderColor: `rgba(${step.accentRgb},0.12)`,
          background: `rgba(${step.accentRgb},0.04)`,
        }}
      >
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{
            background: `rgba(${step.accentRgb},0.12)`,
          }}
        >
          <TaglineIcon className="h-3 w-3" style={{ color: step.accent }} />
        </span>
        <span
          className="font-mono text-[10.5px] font-medium tracking-[0.04em]"
          style={{ color: step.accent }}
        >
          {step.tagline}
        </span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Overlay UI — lighter glass panels, smaller, atmospheric formula
// ─────────────────────────────────────────────────────────────────────
function StepOverlay({
  variant,
  accent,
}: {
  variant: 'intake' | 'inference' | 'explanation'
  accent: string
}) {
  // HUD-style translucent panel — feels like floating clinical UI, not a black rectangle
  const HUDPanel = ({
    children,
    accentRgb,
    className = '',
  }: {
    children: React.ReactNode
    accentRgb: string
    className?: string
  }) => (
    <div
      className={`relative overflow-hidden rounded-xl border ${className}`}
      style={{
        // Lighter translucent navy — monitor visuals show through
        background:
          'linear-gradient(160deg, rgba(8,12,24,0.42) 0%, rgba(12,18,38,0.38) 100%)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        borderColor: `rgba(${accentRgb},0.22)`,
        boxShadow:
          // Inner highlight + accent glow ring + soft drop
          `0 1px 0 rgba(255,255,255,0.10) inset,` +
          `0 0 0 1px rgba(255,255,255,0.04) inset,` +
          `0 0 24px -4px rgba(${accentRgb},0.28),` +
          `0 14px 30px -14px rgba(0,0,0,0.45)`,
      }}
    >
      {/* Top accent hairline (HUD signature) */}
      <div
        aria-hidden
        className="absolute inset-x-3 top-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, rgba(${accentRgb},0.7), transparent)`,
        }}
      />
      {/* Content padding */}
      <div className="relative p-2.5">{children}</div>
    </div>
  )

  if (variant === 'intake') {
    return (
      <HUDPanel accentRgb="56,189,248">
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-mono uppercase tracking-[0.20em] text-slate-200/85">
            Symptom intake
          </span>
          <span className="num font-mono text-emerald-300/95">3 / 24</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <CFChip code="G020" label="Nyeri telinga" cf={0.8} />
          <CFChip code="G004" label="Demam" cf={0.6} />
        </div>
      </HUDPanel>
    )
  }

  if (variant === 'inference') {
    return (
      <HUDPanel accentRgb="167,139,250">
        {/* Header */}
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-mono uppercase tracking-[0.20em] text-slate-200/85">
            CF combination
          </span>
          <span className="font-mono" style={{ color: accent }}>
            R007
          </span>
        </div>
        {/* Formula — atmospheric scientific texture */}
        <div
          className="relative mt-1.5"
          style={{
            opacity: 0.72,
            filter: 'blur(0.25px)',
          }}
        >
          <pre className="whitespace-pre-wrap font-mono text-[8.5px] leading-[1.55] text-slate-100/85">
{`cf₁ = 0.80·1.00 = 0.80
cf₂ = 0.60·0.80 = 0.48
CF  = cf₁ + cf₂·(1−cf₁) = 0.896`}
          </pre>
        </div>
        {/* Result highlight — subtle violet wash on the last line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-5"
          style={{
            background:
              'linear-gradient(to top, rgba(167,139,250,0.16), transparent)',
          }}
        />
        {/* Animated scan-line drift across formula — ambient signal */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-[1px]"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(167,139,250,0.6), transparent)',
            top: '60%',
          }}
          animate={{ opacity: [0, 0.8, 0], y: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </HUDPanel>
    )
  }

  return (
    <HUDPanel accentRgb="52,211,153">
      <div className="flex items-center justify-between text-[9px]">
        <span className="font-mono uppercase tracking-[0.20em] text-slate-200/85">
          Top contributions
        </span>
        <span className="num font-mono text-emerald-300/95">CF 0.78</span>
      </div>
      <div className="mt-1.5 space-y-1.5">
        <ContributionBar
          code="G020"
          label="Nyeri telinga"
          value={0.42}
          highlighted
        />
        <ContributionBar
          code="G023"
          label="Tinnitus"
          value={0.21}
          delay={0.06}
        />
      </div>
    </HUDPanel>
  )
}
