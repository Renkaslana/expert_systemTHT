import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Activity, BrainCircuit, MousePointerClick, Sparkles, Wand2 } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { MiniConfidenceRing } from '@/components/visuals/MiniConfidenceRing'
import { Soundwave } from '@/components/visuals/Soundwave'
import { AnatomyMini } from '@/components/visuals/AnatomyMini'
import { mockDiagnose } from '@/data/mockDiagnosis'
import { CF_WEIGHT_OPTIONS, confidenceColor, cn } from '@/lib/utils'
import { DISEASE_BY_CODE } from '@/data/diseases'
import { IMG } from '@/data/landingImages'

// ─────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────
interface DemoSymptom { code: string; name: string; defaultWeight: number }

const DEMO_SYMPTOMS: DemoSymptom[] = [
  { code: 'G014', name: 'Sakit kepala', defaultWeight: 0.6 },
  { code: 'G005', name: 'Hidung mampet', defaultWeight: 0.8 },
  { code: 'G013', name: 'Pilek', defaultWeight: 0.6 },
  { code: 'G001', name: 'Batuk', defaultWeight: 0.6 },
  { code: 'G003', name: 'Dahak di tenggorok', defaultWeight: 0.4 },
]

const PRESETS = [
  {
    label: 'Demam tinggi · sinus',
    icon: '🌡',
    weights: { G014: 1.0, G005: 0.8, G013: 0.6, G001: 0.4, G003: 0.6 },
  },
  {
    label: 'Hidung tersumbat berat',
    icon: '🫁',
    weights: { G014: 0.4, G005: 1.0, G013: 0.8, G001: 0.6, G003: 0.4 },
  },
  {
    label: 'Pilek ringan',
    icon: '💧',
    weights: { G014: 0.4, G005: 0.6, G013: 0.6, G001: 0.4, G003: 0 },
  },
]

// ─────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────
export function LiveDiagnosisDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [-20, 20])

  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(DEMO_SYMPTOMS.map((s) => [s.code, s.defaultWeight])),
  )
  const [touched, setTouched] = useState(false)

  // Auto-animate before user interaction
  useEffect(() => {
    if (touched) return
    const id = setInterval(() => {
      setWeights((prev) => ({
        ...prev,
        G014: prev.G014 === 0.6 ? 1.0 : 0.6,
      }))
    }, 3500)
    return () => clearInterval(id)
  }, [touched])

  const result = useMemo(() => {
    const map = new Map<string, number>()
    for (const [k, v] of Object.entries(weights)) {
      if (v > 0) map.set(k, v)
    }
    return mockDiagnose(map)
  }, [weights])

  const primary = result[0]
  const c = primary ? confidenceColor(primary.confidenceLevel) : null
  const primaryDisease = primary ? DISEASE_BY_CODE[primary.diseaseCode] : null
  const region = primaryDisease?.iconKey ?? 'general'

  return (
    <section
      ref={sectionRef}
      id="try-engine"
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: 'linear-gradient(180deg, #020610 0%, #030812 100%)' }}
    >
      {/* Photo backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.img
          src={IMG.demoBackdrop.src}
          alt=""
          className="h-full w-full object-cover opacity-20"
          style={{ y: imgY, filter: 'grayscale(0.3) saturate(0.65)' }}
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(2,6,18,0.88) 0%, rgba(2,6,18,0.75) 50%, rgba(2,6,18,0.96) 100%)',
          }}
        />
      </div>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute opacity-[0.16]"
        style={{
          left: '18%', top: '14%',
          width: 600, height: 500,
          background: 'radial-gradient(circle, rgba(56,189,248,0.6) 0%, transparent 65%)',
          filter: 'blur(90px)',
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute opacity-[0.12]"
        style={{
          right: '12%', bottom: '20%',
          width: 500, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
        aria-hidden
      />
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 medical-grid-dark opacity-50" aria-hidden />

      <div className="container relative">
        {/* Header */}
        <div className="text-slate-100">
          <SectionHeader
            align="left"
            eyebrow="Live · Try the Engine"
            title={
              <span className="text-white">
                Geser keyakinan,{' '}
                <span
                  className="italic"
                  style={{
                    background: 'linear-gradient(95deg, #38BDF8 0%, #34D399 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  saksikan diagnosis bergeser.
                </span>
              </span>
            }
            subtitle="Tanpa daftar. Tanpa upload data. Pilih bobot tiap gejala dan Diagnova menghitung ulang peringkat penyakit beserta confidence-nya secara real-time menggunakan Certainty Factor."
            className="!max-w-3xl !text-slate-300"
          />
        </div>

        {/* ── Demo frame ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 overflow-hidden rounded-[28px]"
          style={{
            background: 'rgba(6, 10, 22, 0.88)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 40px 100px -40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Browser chrome */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/25 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] text-slate-400">
                diagnova.app/konsultasi · live preview
              </span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Activity className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                cf engine · v0.1
              </span>
            </div>
          </div>

          {/* Preset toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.05] bg-white/[0.015] px-5 py-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <Wand2 className="h-3 w-3" />
              Try a preset
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setTouched(true)
                  setWeights({ ...p.weights })
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300 transition-all hover:border-sky-400/40 hover:bg-sky-400/[0.07] hover:text-sky-200"
              >
                <span aria-hidden>{p.icon}</span>
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setTouched(true)
                setWeights(Object.fromEntries(DEMO_SYMPTOMS.map((s) => [s.code, 0])))
              }}
              className="ml-auto rounded-full border border-white/[0.06] bg-transparent px-3 py-1.5 text-[11px] text-slate-500 transition-colors hover:border-rose-400/30 hover:text-rose-400"
            >
              Reset
            </button>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-[1fr_minmax(0,440px)]">
            {/* ── Symptom panel ── */}
            <div className="border-b border-white/[0.05] p-6 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                    Panel intake · symptom CF
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">
                    Tingkat keyakinan Anda
                  </h3>
                </div>
                <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] text-slate-500 sm:flex">
                  <MousePointerClick className="h-3 w-3" />
                  Klik untuk mengubah
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {DEMO_SYMPTOMS.map((s) => (
                  <SymptomRow
                    key={s.code}
                    symptom={s}
                    value={weights[s.code] ?? 0}
                    onChange={(v) => {
                      setTouched(true)
                      setWeights((p) => ({ ...p, [s.code]: v }))
                    }}
                  />
                ))}
              </div>

              {/* CF formula teaser */}
              <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
                  MYCIN CF combination formula
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-400">
                  CF(H,e) = cf_user × cf_expert
                </p>
                <p className="font-mono text-[10px] text-slate-400">
                  CF_combined = CF₁ + CF₂·(1 − CF₁)
                </p>
              </div>
            </div>

            {/* ── Result panel ── */}
            <div className="space-y-4 p-6">
              {/* Primary diagnosis */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-black/25 p-5">
                {/* Background glow */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                  style={{ background: c ? `${c.hex}25` : 'rgba(52,211,153,0.15)' }}
                />

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
                    <Sparkles className="h-3 w-3" />
                    Diagnosis utama
                  </span>
                  {primary && (
                    <span className="num font-mono text-[10px] text-slate-600">
                      {primary.diseaseCode}
                    </span>
                  )}
                </div>

                {primary ? (
                  <div className="mt-5 flex items-center gap-5">
                    <MiniConfidenceRing
                      value={primary.cfValue}
                      size={120}
                      stroke={10}
                      color={c?.hex ?? '#10B981'}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <AnatomyMini
                          region={region as 'ear' | 'nose' | 'sinus' | 'throat' | 'general'}
                          size={32}
                        />
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                          {primary.diseaseCategory}
                        </p>
                      </div>
                      <h4 className="mt-1.5 font-display text-[22px] font-semibold leading-tight text-white">
                        {primary.diseaseName}
                      </h4>
                      {c && (
                        <span
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold"
                          style={{
                            color: c.hex,
                            borderColor: `${c.hex}55`,
                            background: `${c.hex}15`,
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.hex }} />
                          {c.label}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-white/[0.02] p-8 text-center">
                    <BrainCircuit className="h-6 w-6 text-slate-600" />
                    <p className="mt-2 text-sm font-medium text-slate-400">
                      Pilih minimal satu gejala
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Sistem akan menampilkan diagnosis di sini
                    </p>
                  </div>
                )}

                {/* Soundwave activity indicator */}
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                  <BrainCircuit className="h-3.5 w-3.5 text-violet-400" />
                  <Soundwave bars={20} className="h-5 flex-1" />
                  <span className="num font-mono text-[10px] text-slate-600">
                    {result.length > 0 ? `${result.length} kandidat` : 'idle'}
                  </span>
                </div>
              </div>

              {/* Ranking */}
              <div className="rounded-2xl border border-white/[0.05] bg-black/15 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Peringkat kandidat
                  </p>
                  {result.length > 0 && (
                    <span className="font-mono text-[10px] text-slate-600">
                      {result.length} penyakit
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {result.length === 0 && (
                    <li className="rounded-lg border border-dashed border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center text-[11px] text-slate-600">
                      Belum ada kandidat
                    </li>
                  )}
                  {result.map((r) => {
                    const cc = confidenceColor(r.confidenceLevel)
                    const isTop = r.rank === 1
                    return (
                      <motion.li
                        key={r.diseaseCode}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-slate-200',
                          isTop
                            ? 'border-emerald-400/30 bg-emerald-400/[0.06]'
                            : 'border-white/[0.05] bg-white/[0.02]',
                        )}
                      >
                        <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.05] font-mono text-[10px] font-bold text-slate-400">
                          #{r.rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{r.diseaseName}</p>
                          <p className="text-[10px] text-slate-600">{r.diseaseCategory}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className="num font-mono text-sm font-semibold"
                            style={{ color: cc.hex }}
                          >
                            {r.cfPercentage}
                          </p>
                          <p className="text-[10px] text-slate-600">{cc.label}</p>
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom hint */}
        <p className="mt-8 text-center font-mono text-[11px] text-slate-600">
          Ini adalah preview interaktif dari CF engine. Untuk sesi konsultasi lengkap dengan semua 24 gejala,{' '}
          <a href="/konsultasi" className="text-sky-500 hover:underline">mulai konsultasi →</a>
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Symptom row with CF selector
// ─────────────────────────────────────────────────────────────────────
function SymptomRow({
  symptom,
  value,
  onChange,
}: {
  symptom: DemoSymptom
  value: number
  onChange: (v: number) => void
}) {
  const cfVal = value
  const pct = cfVal > 0 ? Math.round(cfVal * 100) : 0

  return (
    <div className="group rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.09] hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-100">{symptom.name}</p>
          <p className="num font-mono text-[10px] text-slate-600">{symptom.code}</p>
        </div>
        <div className="flex items-center gap-2">
          {cfVal > 0 && (
            <div
              className="h-1.5 w-10 rounded-full overflow-hidden bg-white/[0.06]"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    cfVal >= 0.8 ? '#10B981' : cfVal >= 0.6 ? '#38BDF8' : cfVal >= 0.4 ? '#F59E0B' : '#94A3B8',
                }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          )}
          <span
            className="num w-8 text-right font-mono text-[11px]"
            style={{
              color: cfVal >= 0.8 ? '#10B981' : cfVal >= 0.6 ? '#38BDF8' : cfVal >= 0.4 ? '#F59E0B' : '#94A3B8',
            }}
          >
            {cfVal > 0 ? cfVal.toFixed(1) : '–'}
          </span>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-6 gap-1">
        {/* "None" button */}
        <button
          type="button"
          onClick={() => onChange(0)}
          className={cn(
            'rounded-md border py-1.5 text-[10px] font-medium transition-all',
            value === 0
              ? 'border-rose-400/40 bg-rose-400/10 text-rose-300'
              : 'border-white/[0.06] bg-transparent text-slate-500 hover:border-rose-400/25 hover:text-rose-400',
          )}
        >
          tidak
        </button>
        {CF_WEIGHT_OPTIONS.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'num rounded-md border py-1.5 font-mono text-[10px] font-semibold transition-all',
                active
                  ? 'border-sky-400/50 bg-sky-400/12 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                  : 'border-white/[0.05] bg-transparent text-slate-500 hover:border-sky-400/25 hover:text-sky-400',
              )}
            >
              {opt.short}
            </button>
          )
        })}
      </div>
    </div>
  )
}
