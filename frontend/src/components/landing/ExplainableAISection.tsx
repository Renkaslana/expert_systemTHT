import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Eye, Lock, ScrollText, Sliders } from 'lucide-react'
import { FloatingPanel } from './primitives/FloatingPanel'
import { ContributionBar } from './primitives/ContributionBar'
import { MiniConfidenceRing } from '@/components/visuals/MiniConfidenceRing'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────
interface RuleRow {
  ruleId: string
  conditions: { code: string; cf: number }[]
  conclusionCode: string
  conclusionCf: number
  source: string
  expanded?: { formula: string; note: string }
}

const RULES: RuleRow[] = [
  {
    ruleId: 'R007',
    conditions: [
      { code: 'G020', cf: 0.8 },
      { code: 'G016', cf: 0.6 },
    ],
    conclusionCode: 'P001',
    conclusionCf: 0.85,
    source: 'Sugicharto · Sp.THT-KL',
    expanded: {
      formula:
        'cf₁ = 0.80 · 1.00 = 0.80\ncf₂ = 0.60 · 0.80 = 0.48\nCF = cf₁ + cf₂·(1−cf₁) = 0.896',
      note:
        'Kombinasi MYCIN klasik: dua premis aktif (Nyeri Telinga + Telinga berair) keduanya konvergen ke Otitis Media Akut.',
    },
  },
  {
    ruleId: 'R012',
    conditions: [
      { code: 'G011', cf: 0.6 },
      { code: 'G023', cf: 0.7 },
    ],
    conclusionCode: 'P001',
    conclusionCf: 0.71,
    source: 'Setyaputri et al. · 2018',
  },
  {
    ruleId: 'R019',
    conditions: [
      { code: 'G004', cf: 0.6 },
      { code: 'G014', cf: 0.4 },
    ],
    conclusionCode: 'P001',
    conclusionCf: 0.42,
    source: 'WHO · ICD-10 H66.0',
  },
]

const PILLARS = [
  {
    icon: Eye,
    title: 'Auditable',
    accent: '#38BDF8',
    desc: 'Setiap baris kesimpulan menunjuk ke aturan inferensi spesifik (R007, R012, …) dan dapat di-expand untuk melihat aritmetika MYCIN klasik di baliknya.',
  },
  {
    icon: ScrollText,
    title: 'Sourced',
    accent: '#F59E0B',
    desc: 'Bobot pakar berasal dari literatur peer-reviewed dan dr. M. Agus Sugicharto, Sp.THT-KL — bukan halusinasi model bahasa.',
  },
  {
    icon: Sliders,
    title: 'Adjustable',
    accent: '#34D399',
    desc: 'User mengontrol bobot CF mereka sendiri (0.2–1.0). Simulasikan "bagaimana jika nyeri lebih ringan?" dan saksikan diagnosis bergeser real-time.',
  },
  {
    icon: Lock,
    title: 'Traceable',
    accent: '#A78BFA',
    desc: 'Setiap probabilitas memiliki jejak lengkap dari gejala input → rule aktif → rumus kombinasi → skor akhir. Tidak ada keajaiban tersembunyi.',
  },
]

// ─────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────
export function ExplainableAISection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <section
      ref={sectionRef}
      id="explainable"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: 'linear-gradient(180deg, #030610 0%, #050914 50%, #060B18 100%)',
      }}
    >
      {/* Amber halo — "knowledge glow" */}
      <div
        className="pointer-events-none absolute opacity-[0.18]"
        style={{
          left: '18%', top: '22%',
          width: 760, height: 640,
          background: 'radial-gradient(circle, rgba(245,158,11,0.42) 0%, transparent 60%)',
          filter: 'blur(90px)',
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden
      />
      {/* Right-side cyan accent */}
      <div
        className="pointer-events-none absolute opacity-[0.12]"
        style={{
          right: '8%', top: '60%',
          width: 540, height: 440,
          background: 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
        aria-hidden
      />
      {/* Medical grid */}
      <div className="pointer-events-none absolute inset-0 medical-grid-dark opacity-50" aria-hidden />

      <div className="container relative">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">

          {/* ─── Left: cinematic image + overlay inspector ─── */}
          <div className="relative">
            {/* Background photograph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[560px] w-full overflow-hidden rounded-[28px]"
              style={{
                border: '1px solid rgba(245,158,11,0.15)',
                boxShadow: '0 0 0 1px rgba(245,158,11,0.08), 0 40px 100px -30px rgba(0,0,0,0.75)',
              }}
            >
              <motion.img
                src="/img-inspector.png"
                alt="Inspektur penalaran AI — jejak Certainty Factor diagnosis ENT"
                className="h-full w-full object-cover"
                style={{ y: imgY }}
                loading="lazy"
                decoding="async"
              />
              {/* Overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(3,6,13,0.45) 0%, rgba(3,6,13,0.08) 38%, rgba(3,6,13,0.88) 100%)',
                }}
                aria-hidden
              />
              {/* Caption */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div className="text-slate-100">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-400/80">
                    Reasoning Inspector
                  </p>
                  <p className="mt-1 font-display text-lg font-medium">
                    Lihat penalaran di balik diagnosis.
                  </p>
                </div>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md">
                  live trace
                </span>
              </div>
            </motion.div>

          </div>

          {/* ─── Right: pillars + quote ─── */}
          <div className="text-slate-100 lg:pl-2 lg:pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-400/80">
              Open the black box
            </span>
            <h2
              className="mt-5 font-display font-medium leading-[1.04] tracking-tight"
              style={{ fontSize: 'clamp(36px, 4.5vw, 52px)', color: '#F8FAFC' }}
            >
              Diagnosis yang{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(102deg, #F59E0B 0%, #F8FAFC 55%, #38BDF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                bisa Anda audit
              </span>{' '}
              baris demi baris.
            </h2>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-slate-400">
              Setiap angka kepercayaan punya akar. Diagnova menampilkan rumus kombinasi
              Certainty Factor, aturan yang aktif, sumber pakar, dan kontribusi tiap gejala
              — bukan opini hitam-putih sebuah model bahasa.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Pillar key={p.title} {...p} index={i} />
              ))}
            </div>

            {/* Design principle quote */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5"
            >
              <p className="font-display text-[19px] font-medium leading-snug text-slate-200">
                "Every diagnosis cites the symptoms and rules that produced it."
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
                Diagnova design principle · 01
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Reasoning card
// ─────────────────────────────────────────────────────────────────────
function ReasoningCard() {
  const [open, setOpen] = useState<string | null>('R007')

  return (
    <FloatingPanel tone="dark" accent="#F59E0B" className="overflow-hidden">
      {/* Mac-style chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
          diagnova / reasoning inspector
        </span>
        <span className="rounded-full bg-amber-400/10 px-2 py-0.5 font-mono text-[9px] text-amber-300">
          live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[auto_1fr]">
        {/* Primary diagnosis ring */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-black/30 px-4 py-4">
          <MiniConfidenceRing
            value={0.78}
            size={100}
            stroke={8}
            color="#F59E0B"
            label="confidence"
          />
          <div className="mt-3 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Primary · P001
            </p>
            <p className="font-display text-sm font-semibold text-white">Otitis Media Akut</p>
            <p className="font-mono text-[9px] text-slate-600">ICD-10 · H66.0</p>
          </div>
          <div className="mt-4 w-full space-y-1.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Top contributions
            </p>
            <ContributionBar code="G020" label="Nyeri telinga" value={0.42} highlighted />
            <ContributionBar code="G023" label="Tinnitus" value={0.21} delay={0.05} />
            <ContributionBar code="G004" label="Demam" value={0.10} delay={0.10} />
          </div>
        </div>

        {/* Rule stack */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Active inference rules
            </p>
            <p className="font-mono text-[9px] text-slate-600">3 / 12</p>
          </div>
          {RULES.map((r, idx) => (
            <RuleAccordion
              key={r.ruleId}
              rule={r}
              isOpen={open === r.ruleId}
              onToggle={() => setOpen((cur) => (cur === r.ruleId ? null : r.ruleId))}
              index={idx}
            />
          ))}
        </div>
      </div>
    </FloatingPanel>
  )
}

function RuleAccordion({
  rule,
  isOpen,
  onToggle,
  index,
}: {
  rule: RuleRow
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const canExpand = !!rule.expanded
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={cn(
        'overflow-hidden rounded-xl border transition-colors duration-200',
        isOpen ? 'border-amber-400/30 bg-amber-400/[0.04]' : 'border-white/[0.06] bg-white/[0.02]',
      )}
    >
      <button
        type="button"
        onClick={canExpand ? onToggle : undefined}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left',
          canExpand ? 'cursor-pointer hover:bg-white/[0.03]' : 'cursor-default',
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[10px] text-slate-300">
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[9px] font-semibold',
              isOpen ? 'bg-amber-400/15 text-amber-300' : 'bg-white/[0.04] text-slate-500',
            )}
          >
            {rule.ruleId}
          </span>
          <span className="text-slate-600">IF</span>
          {rule.conditions.map((c, i) => (
            <span key={c.code} className="inline-flex items-center gap-1">
              {i > 0 && <span className="text-slate-600">∧</span>}
              <span className="text-sky-400">{c.code}</span>
              <span className="text-slate-600">({c.cf.toFixed(1)})</span>
            </span>
          ))}
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400">{rule.conclusionCode}</span>
          <span className="num font-semibold text-emerald-400">
            {rule.conclusionCf.toFixed(2)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden rounded-full border border-white/[0.06] bg-black/30 px-1.5 py-0.5 font-mono text-[9px] text-slate-500 md:block">
            {rule.source}
          </span>
          {canExpand && (
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-slate-500 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          )}
        </div>
      </button>

      {canExpand && isOpen && rule.expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-amber-400/15 bg-black/20 px-4 py-3"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-400/80">
            CF combination · MYCIN form
          </p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-slate-200">
            {rule.expanded.formula}
          </pre>
          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">
            {rule.expanded.note}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

function Pillar({
  icon: Icon,
  title,
  accent,
  desc,
  index,
}: {
  icon: typeof Eye
  title: string
  accent: string
  desc: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.10] hover:bg-white/[0.04]"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
        style={{ background: `${accent}12`, borderColor: `${accent}30` }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div>
        <h3 className="font-display text-[17px] font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">{desc}</p>
      </div>
    </motion.div>
  )
}
