import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, PlayCircle, Stethoscope, FileText, Workflow } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MiniConfidenceRing } from '@/components/visuals/MiniConfidenceRing'

/**
 * Diagnova hero — premium editorial medical intelligence.
 *
 * Composition rules:
 *  • The image is the visual identity — full-bleed right, feathered into
 *    the atmosphere on its left/top/bottom edges. Never boxed.
 *  • One diagnostic preview overlay. No scattered widgets.
 *  • Asymmetric grid: copy ~58% / immersive imagery ~42% (image bleeds wider)
 *  • Light mode = soft blue-white sanctuary; Dark mode = cinematic navy
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Mouse parallax ───────────────────────────────────────────────────
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 50, damping: 20, mass: 0.8 })

  const photoX = useTransform(sx, (v) => v * 8)
  const photoY = useTransform(sy, (v) => v * 8)
  const cardX = useTransform(sx, (v) => v * -10)
  const cardY = useTransform(sy, (v) => v * -6)

  // ── Scroll choreography ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const photoYScroll = useTransform(scrollYProgress, [0, 1], [0, 60])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.04])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.6])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      mx.set((e.clientX - left) / width - 0.5)
      my.set((e.clientY - top) / height - 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background"
      style={{ minHeight: '100svh' }}
      aria-label="Diagnova — pre-konsultasi ENT yang dapat dijelaskan"
    >
      {/* ═══════════════════════════════════════════════════════════════
          1. ATMOSPHERIC BACKGROUND
             Light: soft blue-white sanctuary.
             Dark : cinematic navy.
      ═══════════════════════════════════════════════════════════════ */}

      {/* Light mode canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background:
            'radial-gradient(75% 60% at 78% 8%, rgba(56,189,248,0.34) 0%, rgba(56,189,248,0.10) 35%, transparent 65%),' +
            'radial-gradient(50% 70% at 70% 50%, rgba(14,165,233,0.20) 0%, transparent 60%),' +
            'radial-gradient(60% 50% at 8% 18%, rgba(99,102,241,0.12) 0%, transparent 60%),' +
            'radial-gradient(70% 60% at 0% 105%, rgba(59,130,246,0.10) 0%, transparent 60%),' +
            'linear-gradient(180deg, #EEF4FC 0%, #E5EEFA 30%, #F2F7FD 70%, #EAF1FB 100%)',
        }}
      />

      {/* Dark mode canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(75% 60% at 78% 8%, rgba(56,189,248,0.32) 0%, rgba(56,189,248,0.08) 35%, transparent 65%),' +
            'radial-gradient(50% 70% at 72% 50%, rgba(14,165,233,0.22) 0%, transparent 60%),' +
            'radial-gradient(60% 50% at 8% 18%, rgba(99,102,241,0.20) 0%, transparent 60%),' +
            'radial-gradient(70% 60% at 0% 105%, rgba(59,130,246,0.16) 0%, transparent 60%),' +
            'linear-gradient(180deg, #060B1E 0%, #08122A 35%, #050917 75%, #030711 100%)',
        }}
      />

      {/* Diagonal cinematic key light from upper-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(220deg, rgba(186,230,253,0.46) 0%, rgba(186,230,253,0.0) 38%)',
          mixBlendMode: 'screen',
          opacity: 0.7,
        }}
      />

      {/* Whisper grid — barely there, masked at edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 medical-grid dark:medical-grid-dark"
        style={{
          opacity: 0.4,
          maskImage:
            'radial-gradient(ellipse 65% 50% at 28% 45%, black 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 50% at 28% 45%, black 0%, transparent 75%)',
        }}
      />

      {/* Editorial vertical hairline (left margin mark, lg+) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[5vw] top-0 hidden h-full w-px lg:block"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(15,23,42,0.07) 22%, rgba(15,23,42,0.07) 78%, transparent 100%) ',
        }}
      />

      {/* Subtle film grain — paper-like texture, only at low opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.07] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          2. HERO IMAGE — full-bleed right, feathered into atmosphere
             Image carries its own anatomy visualization (built-in).
             We add a luminous halo so it feels embedded, not pasted.
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ x: photoX, y: photoY }}
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[72%] xl:w-[68%] 2xl:w-[64%] lg:block"
      >
        {/* Cinematic cyan key bloom — image emerges from this halo */}
        <div
          aria-hidden
          className="absolute -inset-x-24 -inset-y-20"
          style={{
            background:
              'radial-gradient(50% 55% at 50% 50%, rgba(56,189,248,0.42) 0%, rgba(56,189,248,0.16) 40%, rgba(56,189,248,0.04) 65%, transparent 80%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Secondary cooler bloom for depth */}
        <div
          aria-hidden
          className="absolute -inset-x-12 -inset-y-12"
          style={{
            background:
              'radial-gradient(70% 60% at 55% 60%, rgba(14,165,233,0.18) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
        />

        {/* The photograph — masked to dissolve into atmosphere */}
        <motion.div
          style={{ y: photoYScroll, scale: photoScale }}
          className="relative h-full w-full"
        >
          <img
            src="/images/hero/medical-ent-hero.png"
            alt="Dokter spesialis THT dengan visualisasi anatomi telinga holografik"
            className="h-full w-full object-cover object-[88%_center]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{
              // Balanced elliptical mask — wider sharp core (visible content
              // stays prominent), only the LEFT edge feathers into the text
              // area for a clean asymmetric blend.
              maskImage:
                'radial-gradient(ellipse 88% 100% at 52% 50%, black 50%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.20) 95%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 88% 100% at 52% 50%, black 50%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.20) 95%, transparent 100%)',
            }}
          />

          {/* Tighter left-edge linear feather — image dissolves into text area
              but stays prominent in the visible composition */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, hsl(var(--background)) 0%, hsla(var(--background),0.85) 4%, hsla(var(--background),0.45) 10%, hsla(var(--background),0.15) 18%, hsla(var(--background),0) 26%)',
            }}
          />

          {/* Top fade — image dissolves under navbar */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32"
            style={{
              background:
                'linear-gradient(to bottom, hsl(var(--background)) 0%, hsla(var(--background),0) 100%)',
            }}
          />

          {/* Bottom fade — into stats row / next section */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                'linear-gradient(to top, hsl(var(--background)) 0%, hsla(var(--background),0) 100%)',
            }}
          />

          {/* Subtle cool grade in light mode (so the dark image feels less harsh
              against the airy blue-white atmosphere) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 dark:hidden"
            style={{
              background:
                'radial-gradient(80% 80% at 30% 50%, rgba(186,230,253,0.16) 0%, transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          3. SINGLE PREMIUM DIAGNOSTIC PREVIEW CARD
             Bottom-right, overlapping image. The only floating widget.
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ x: cardX, y: cardY }}
        className="pointer-events-none absolute z-[4] hidden lg:block"
      >
        <div
          className="absolute"
          style={{
            right: '6%',
            bottom: '24%',
            width: 340,
          }}
        >
          {/* Soft radial glow under card */}
          <div
            aria-hidden
            className="absolute -inset-8"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 60%, rgba(56,189,248,0.28) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* The card */}
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl border border-white/[0.08]',
              'bg-[rgba(8,12,24,0.78)] backdrop-blur-2xl backdrop-saturate-150',
            )}
            style={{
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.10) inset,' +
                '0 36px 80px -24px rgba(2,6,23,0.65),' +
                '0 12px 28px -8px rgba(2,6,23,0.45)',
            }}
          >
            {/* Top hairline accent */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(56,189,248,0.65), transparent)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-sky-300/90">
                Preview Diagnosis
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.20em] text-slate-400">
                CF Score
              </span>
            </div>

            {/* Body */}
            <div className="flex items-center gap-4 px-5 py-4">
              <MiniConfidenceRing
                value={0.87}
                size={64}
                stroke={5}
                color="#34D399"
                showLabel
              />
              <div className="flex flex-col">
                <span className="font-display text-[18px] font-medium leading-tight text-white">
                  Otitis Media Akut
                </span>
                <span className="mt-1 font-mono text-[10px] tracking-wider text-slate-300/85">
                  CF: 0.87 · 3 Aturan Aktif
                </span>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                  <span className="text-[11px] text-emerald-300">
                    Tingkat kepastian tinggi
                  </span>
                </div>
              </div>
            </div>

            {/* Reasoning bars footer */}
            <div className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'Otitis Media',   pct: 0.87, color: '#34D399' },
                  { label: 'Otitis Eksterna', pct: 0.42, color: '#FBBF24' },
                  { label: 'Sinusitis',       pct: 0.18, color: '#94A3B8' },
                ].map((h) => (
                  <div key={h.label} className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-slate-300/80 min-w-[88px]">
                      {h.label}
                    </span>
                    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${h.pct * 100}%` }}
                        transition={{ delay: 1.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: h.color }}
                      />
                    </div>
                    <span className="font-mono text-[9px] tabular-nums text-slate-400 min-w-[28px] text-right">
                      {(h.pct * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          4. MAIN COMPOSITION — text left (wider), image bleeds right
      ═══════════════════════════════════════════════════════════════ */}
      <div className="container relative z-10 flex min-h-[100svh] items-center pt-24 pb-32 md:pt-28 md:pb-36">
        <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-12">

          {/* ─── COPY COLUMN — wide, generous, editorial ───────────── */}
          <motion.div
            className="relative lg:col-span-7 xl:col-span-7"
            style={{ y: copyY, opacity: copyOpacity }}
          >
            {/* Eyebrow — luminous pill with pulsing dot */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5',
                'border border-sky-200/70 bg-white/65 backdrop-blur-md',
                'shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_4px_16px_-6px_rgba(56,189,248,0.30)]',
                'dark:border-sky-400/20 dark:bg-white/[0.04]',
                'dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_4px_20px_-6px_rgba(56,189,248,0.28)]',
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-sky-400/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">
                Explainable Medical Intelligence
              </span>
            </motion.div>

            {/* Headline — 3-line editorial rhythm, italic cyan accent */}
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.12, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'mt-7 font-display font-medium tracking-[-0.03em] text-balance',
                'text-[clamp(44px,5.4vw,76px)]',
                'leading-[0.95]',
                'text-slate-900 dark:text-white',
              )}
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60' }}
            >
              <span className="block">Diagnosis</span>
              <span className="block">yang bisa</span>
              <span className="block">
                Anda{' '}
                <span
                  className={cn(
                    'italic font-normal',
                    'bg-clip-text text-transparent',
                    'bg-gradient-to-br from-sky-500 via-cyan-600 to-indigo-600',
                    'dark:from-sky-300 dark:via-cyan-300 dark:to-indigo-300',
                  )}
                  style={{
                    filter: 'drop-shadow(0 4px 24px rgba(14,165,233,0.22))',
                  }}
                >
                  telusuri.
                </span>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7, ease: 'easeOut' }}
              className="mt-7 max-w-[52ch] text-[1.04rem] leading-[1.72] text-slate-600 dark:text-slate-300/85"
            >
              Diagnova adalah sistem pakar THT berbasis Certainty Factor &amp;
              forward chaining. Setiap hasil diagnosis dilengkapi alasan,
              aturan, dan tingkat kepastian yang transparan.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.6 }}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <Link
                to="/konsultasi"
                className={cn(
                  'group relative inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5',
                  'text-[14.5px] font-semibold tracking-[-0.005em] text-primary-foreground',
                  'bg-primary',
                  'shadow-[0_0_0_1px_hsl(var(--brand)/0.5)_inset,0_10px_30px_-10px_hsl(var(--brand)/0.55)]',
                  'transition-[transform,box-shadow] duration-300 ease-expo',
                  'hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(var(--brand)/0.65)_inset,0_18px_44px_-10px_hsl(var(--brand)/0.7)]',
                  'active:translate-y-0',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                Mulai Konsultasi
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className={cn(
                  'group inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5',
                  'text-[14.5px] font-medium text-slate-700 dark:text-slate-300',
                  'border border-slate-300/60 dark:border-white/10',
                  'bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm',
                  'transition-colors duration-300',
                  'hover:bg-white/70 hover:text-slate-900 hover:border-slate-300',
                  'dark:hover:bg-white/[0.06] dark:hover:text-white dark:hover:border-white/15',
                )}
              >
                <PlayCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Lihat Cara Kerja
              </a>
            </motion.div>
          </motion.div>

          {/* ─── MOBILE-ONLY image (lg:hidden) ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:hidden"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[24px] border border-foreground/[0.06] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)] dark:border-white/[0.08]">
              <img
                src="/images/hero/medical-ent-hero.png"
                alt="Dokter spesialis THT dengan visualisasi anatomi telinga holografik"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(3,6,13,0) 50%, rgba(3,6,13,0.7) 100%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          5. STATS BAND — anchored to bottom of hero, full width
             3 columns with icons, premium horizontal spacing.
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.8 }}
        className="absolute inset-x-0 bottom-0 z-[6] hidden pb-10 lg:block"
      >
        <div className="container">
          {/* Hairline above stats */}
          <div
            aria-hidden
            className="mb-5 h-px w-full"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(15,23,42,0.10) 20%, rgba(15,23,42,0.10) 80%, transparent)',
            }}
          />
          <div
            aria-hidden
            className="hidden dark:block"
            style={{
              marginTop: -20,
              marginBottom: 20,
              height: 1,
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.10) 80%, transparent)',
            }}
          />
          <div className="grid grid-cols-3 gap-12 max-w-[640px]">
            <Stat
              icon={<Stethoscope className="h-4 w-4" />}
              value="24+"
              label="Gejala THT"
            />
            <Stat
              icon={<FileText className="h-4 w-4" />}
              value="5"
              label="Kondisi ICD-10"
            />
            <Stat
              icon={<Workflow className="h-4 w-4" />}
              value="47"
              label="Aturan Inferensi"
            />
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          6. SECTION TRANSITION — smooth fade into next section
      ═══════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24"
        style={{
          background:
            'linear-gradient(to bottom, transparent, hsl(var(--background)) 90%)',
        }}
      />
    </section>
  )
}

/* ─── Stat sub-component ────────────────────────────────────────────── */
function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Icon container */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          'border border-sky-200/60 bg-white/70 text-sky-600',
          'shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_2px_8px_-2px_rgba(56,189,248,0.20)]',
          'dark:border-sky-400/15 dark:bg-white/[0.04] dark:text-sky-300',
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-display text-[24px] font-medium leading-none tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
    </div>
  )
}
