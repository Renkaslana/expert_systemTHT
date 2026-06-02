import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Shield, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function CTASection() {
  return (
    <section
      id="get-started"
      className="cv-auto relative isolate overflow-hidden"
      style={{ background: '#02040D' }}
    >
      {/* ── Full-bleed cinematic image ── */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/img-cta.png"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Multi-layer cinematic overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(2,4,13,0.72) 0%, rgba(2,4,13,0.55) 40%, rgba(2,4,13,0.90) 100%)',
          }}
        />
        {/* Color grade: amber warmth at center bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(75% 55% at 50% 100%, rgba(245,158,11,0.18) 0%, transparent 65%)',
          }}
        />
        {/* Cyan top edge accent */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 35% at 50% 0%, rgba(56,189,248,0.12) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 medical-grid-dark opacity-40" aria-hidden />

      {/* ── Content ── */}
      <div className="container relative py-36 md:py-52">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/65" />
              <span className="relative h-2 w-2 rounded-full bg-amber-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-300">
              Begin a diagnosis · Mulai konsultasi
            </span>
          </div>

          {/* Headline */}
          <h2
            className="mt-8 font-display font-medium leading-[1.0] tracking-tight text-balance text-white"
            style={{ fontSize: 'clamp(46px, 7vw, 86px)' }}
          >
            Ready when{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(95deg, #F59E0B 0%, #ffffff 48%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              you are.
            </span>
          </h2>

          {/* Sub-copy */}
          <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-slate-300">
            Tanpa akun. Tanpa upload data sensitif. Riwayat tersimpan lokal di perangkat Anda.
            Hasil dapat dibagikan dan dicetak — siap dibawa saat bertemu dokter spesialis THT.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/konsultasi"
              className={cn(
                'group relative inline-flex min-w-[250px] items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-9 py-4.5 text-[1.05rem] font-semibold text-white transition-all duration-200',
                'bg-gradient-to-br from-sky-500 to-sky-600',
                'shadow-[0_0_32px_rgba(14,165,233,0.5),0_6px_24px_rgba(14,165,233,0.3)]',
                'hover:shadow-[0_0_48px_rgba(14,165,233,0.65),0_8px_32px_rgba(14,165,233,0.4)]',
                'hover:from-sky-400 hover:to-sky-500',
              )}
              style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
            >
              <span className="shimmer-sweep pointer-events-none absolute inset-0" aria-hidden />
              <Sparkles className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              Mulai Konsultasi
              <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/tentang"
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-[1.125rem] text-[1.05rem] font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-white/24 hover:bg-white/[0.10]"
            >
              Pelajari metodologi
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400/70" />
              ~3 menit
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />
              Tanpa akun
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-sky-400/70" />
              Educational only · bukan pengganti dokter
            </span>
          </div>
        </motion.div>

        {/* ── Decorative data cards ── */}
        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
          {[
            { n: '24', label: 'Validated symptoms', accent: '#38BDF8', icon: '◉' },
            { n: '5', label: 'ICD-10 conditions', accent: '#A78BFA', icon: '◈' },
            { n: '100%', label: 'Traceable logic', accent: '#34D399', icon: '◎' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center rounded-2xl border border-white/[0.07] bg-white/[0.04] px-5 py-4 text-center backdrop-blur-md"
            >
              <span className="text-lg" style={{ color: item.accent }}>{item.icon}</span>
              <p className="num mt-2 font-display text-3xl font-semibold text-white">{item.n}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
