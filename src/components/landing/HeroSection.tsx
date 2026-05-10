import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ChevronDown, Compass, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MiniConfidenceRing } from '@/components/visuals/MiniConfidenceRing'

/**
 * Cinematic, image-first hero. The doctor/patient photograph is the primary
 * focal point — a single, restrained diagnostic card overlays the bottom of
 * the image. No symptom intake / contribution panels here; those belong in
 * deeper sections. The composition reads as editorial healthcare, not as a
 * SaaS dashboard.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Mouse parallax (gentle, springy) ────────────────────────────────
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.7 })

  const photoX = useTransform(sx, (v) => v * 8)
  const photoY = useTransform(sy, (v) => v * 8)
  const cardX = useTransform(sx, (v) => v * -14)
  const cardY = useTransform(sy, (v) => v * 10)

  // ── Scroll choreography ─────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const photoYScroll = useTransform(scrollYProgress, [0, 1], [0, 80])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.6])

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
      className="section-airy relative isolate overflow-hidden"
      style={{
        minHeight: '100svh',
      }}
    >
      {/* ── Single, restrained ambient halo (not 3 colored orbs) ── */}
      <div
        className="pointer-events-none absolute"
        aria-hidden
        style={{
          left: '72%',
          top: '12%',
          width: 760,
          height: 640,
          background:
            'radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 60%)',
          filter: 'blur(90px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* ── Editorial vertical hairline (left margin mark) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6vw] top-0 hidden h-full w-px lg:block"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 22%, rgba(255,255,255,0.06) 78%, transparent 100%)',
        }}
      />

      {/* ── Soft grid (much weaker than before) ── */}
      <div
        className="pointer-events-none absolute inset-0 medical-grid-dark opacity-[0.20]"
        style={{
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 50%, black 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 50%, black 0%, transparent 75%)',
        }}
        aria-hidden
      />

      {/* ── Main composition ── */}
      <div className="container relative z-10 flex min-h-[100svh] items-center pt-24 pb-20 md:pt-28 md:pb-28">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">

          {/* ─── Copy column (editorial, restrained) ─────────────────── */}
          <motion.div
            className="relative max-w-[560px]"
            style={{ y: copyY, opacity: copyOpacity }}
          >
            {/* Issue/series label — editorial magazine style */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-sky-300/70">
                Vol. 01
              </span>
              <span className="h-px w-10 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
                Explainable ENT diagnosis
              </span>
            </motion.div>

            {/* Headline — softer, more editorial, less "SaaS" */}
            <motion.h1
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.1, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display font-medium leading-[0.96] tracking-tight text-balance text-foreground dark:text-white"
              style={{ fontSize: 'clamp(40px, 5.4vw, 72px)' }}
            >
              Setiap diagnosis,{' '}
              <span className="text-gradient-hero italic">punya alasannya.</span>
            </motion.h1>

            {/* Quiet subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7, ease: 'easeOut' }}
              className="mt-7 max-w-[460px] text-[1.02rem] leading-[1.7] text-muted-foreground dark:text-slate-300/80"
            >
              Diagnova adalah sistem pakar untuk gangguan Telinga, Hidung, dan
              Tenggorokan. Setiap angka kepercayaan dapat ditelusuri kembali ke
              gejala dan aturan klinis yang menghasilkannya.
            </motion.p>

            {/* CTAs — calmer, more confident */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.6 }}
              className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <Link
                to="/konsultasi"
                className={cn(
                  'group relative inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-[15px] font-semibold text-white',
                  'bg-gradient-to-br from-sky-400 to-sky-600',
                  'shadow-[0_0_0_1px_rgba(14,165,233,0.35)_inset,0_12px_32px_-8px_rgba(14,165,233,0.55)]',
                  'transition-[transform,box-shadow] duration-300 ease-expo',
                  'hover:shadow-[0_0_0_1px_rgba(14,165,233,0.45)_inset,0_18px_44px_-8px_rgba(14,165,233,0.7)]',
                  'hover:-translate-y-0.5 active:translate-y-0',
                )}
              >
                <Sparkles className="h-4 w-4" />
                Mulai Konsultasi
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-medium text-foreground/80 dark:text-slate-300 transition-colors hover:text-foreground dark:hover:text-white"
              >
                <Compass className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Bagaimana cara kerjanya
              </a>
            </motion.div>

            {/* Quiet trust line — replaces all the dashboard stats */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-12 max-w-[440px] text-[12.5px] leading-relaxed text-muted-foreground dark:text-slate-500"
            >
              <span className="text-foreground dark:text-slate-300">24 gejala</span> · {' '}
              <span className="text-foreground dark:text-slate-300">5 kondisi ICD-10</span> ·{' '}
              <span className="text-foreground dark:text-slate-300">Certainty Factor reasoning</span>
              <br />
              Tanpa akun. Riwayat tersimpan lokal di perangkat Anda.
            </motion.p>
          </motion.div>

          {/* ─── Image column (the centerpiece) ─────────────────────── */}
          <div className="relative mx-auto w-full max-w-[680px]">
            {/* Cyan rim light glowing behind the photo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8"
              style={{
                background:
                  'radial-gradient(60% 50% at 50% 50%, rgba(14,165,233,0.30) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ x: photoX, y: photoY }}
              className="relative"
            >
              {/* Top-left editorial number caption (outside frame) */}
              <div className="absolute -left-1 -top-7 hidden items-center gap-2 lg:flex">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Plate 01 · ENT exam
                </span>
                <span className="h-px w-8 bg-white/10" />
              </div>

              <motion.div
                style={{ y: photoYScroll, scale: photoScale }}
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-white/[0.10]"
              >
                {/* Image */}
                <img
                  src="/img-hero.png"
                  alt="Dokter spesialis THT memeriksa telinga pasien dengan otoskop"
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />

                {/* Cinematic darkness — bottom-heavy so the doctor's face stays clear */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(3,6,13,0.10) 0%, rgba(3,6,13,0) 32%, rgba(3,6,13,0) 56%, rgba(3,6,13,0.78) 100%)',
                  }}
                />

                {/* Subtle cyan tint vignette */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(120% 80% at 100% 100%, rgba(14,165,233,0.18) 0%, transparent 55%)',
                    mixBlendMode: 'screen',
                  }}
                />

                {/* Inner luminous border */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[28px]"
                  style={{
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.10)',
                  }}
                />

                {/* Editorial caption inside image, top-right */}
                <div className="absolute right-5 top-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-md">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-200">
                      live · real-time reasoning
                    </span>
                  </div>
                </div>

                {/* Bottom-left film caption */}
                <div className="absolute inset-x-6 bottom-6 max-w-[58%]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-sky-200/80">
                    Pre-consultation
                  </p>
                  <p className="mt-1.5 font-display text-xl font-medium italic leading-tight text-white/95">
                    Bawa hasil ke dokter,
                    <br />
                    bukan asumsi.
                  </p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Quiet scroll cue ── */}
      <motion.a
        href="#how-it-works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-slate-500 transition-colors hover:text-slate-300 lg:flex"
        aria-label="Gulir ke bagian cara kerja"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.32em]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </motion.a>

      {/* ── Bottom fade into next section ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, transparent, hsl(var(--background)))',
        }}
        aria-hidden
      />
    </section>
  )
}

