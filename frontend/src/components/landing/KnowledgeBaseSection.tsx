import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Layers, Microscope, TrendingUp } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { buttonVariants } from '@/components/ui/button'
import { DISEASES, CF_RULES } from '@/data/diseases'
import { SYMPTOM_BY_CODE } from '@/data/symptoms'
import { AnatomyMini } from '@/components/visuals/AnatomyMini'
import { SmartImage } from './primitives/SmartImage'
import { IMG } from '@/data/landingImages'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────
// Disease → photo mapping
// ─────────────────────────────────────────────────────────────────────
const DISEASE_PHOTO: Record<string, typeof IMG.diseaseEar> = {
  P001: IMG.diseaseEar,
  P002: IMG.diseaseSerumen,
  P003: IMG.diseaseExterna,
  P004: IMG.diseaseSinus,
  P005: IMG.diseaseRhinitis,
}

// Category accent colors
const CATEGORY_ACCENT: Record<string, string> = {
  'Telinga': '#38BDF8',
  'Hidung': '#A78BFA',
  'Sinus': '#F59E0B',
  'Tenggorokan': '#34D399',
}

function accentForDisease(category: string): string {
  for (const [k, v] of Object.entries(CATEGORY_ACCENT)) {
    if (category.toLowerCase().includes(k.toLowerCase())) return v
  }
  return '#38BDF8'
}

// ─────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────
export function KnowledgeBaseSection() {
  const [featured, ...rest] = DISEASES
  const totalSymptoms = new Set(CF_RULES.map((r) => r.symptomCode)).size
  const totalRules = CF_RULES.length

  return (
    <section
      id="knowledge"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background:
          'radial-gradient(130% 80% at 30% 0%, hsl(var(--background)) 0%, hsl(var(--muted)/0.7) 60%, hsl(var(--background)) 100%)',
      }}
    >
      {/* Subtle paper grain */}
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.025] dark:opacity-[0.04]" aria-hidden />
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 medical-grid opacity-30 dark:opacity-20" aria-hidden />

      <div className="container relative">
        {/* ── Header row ── */}
        <div className="grid items-end gap-10 md:grid-cols-[1.5fr_1fr]">
          <SectionHeader
            align="left"
            eyebrow="The Disease Atlas · Knowledge Base"
            title={
              <span className="text-ink dark:text-white">
                Lima kondisi ENT,{' '}
                <span className="italic text-gradient-cool">
                  satu basis pengetahuan terbuka.
                </span>
              </span>
            }
            subtitle="Tiap entri menyertakan kode ICD-10, gejala diagnostik beserta bobot pakar, sumber referensi klinis, dan saran penanganan awal."
            className="!max-w-2xl"
          />

          <div className="flex flex-col items-start gap-5 md:items-end">
            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <KBStat n={DISEASES.length} label="kondisi" icon={Layers} color="#38BDF8" />
              <div className="h-3 w-px bg-border/60" />
              <KBStat n={totalSymptoms} label="gejala" icon={Microscope} color="#A78BFA" />
              <div className="h-3 w-px bg-border/60" />
              <KBStat n={totalRules} label="rules" icon={TrendingUp} color="#34D399" />
            </div>
            <Link
              to="/penyakit"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'group gap-2 transition-all hover:border-primary/60',
              )}
            >
              Lihat semua kondisi
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="editorial-hairline mt-10" />

        {/* ── Featured + card grid ── */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <FeaturedDiseaseCard disease={featured} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rest.map((d, idx) => {
              const rules = CF_RULES.filter((r) => r.diseaseCode === d.code)
                .sort((a, b) => b.expertWeight - a.expertWeight)
                .slice(0, 3)
              const peak = rules[0]?.expertWeight ?? 0
              const photo = DISEASE_PHOTO[d.code]
              const region = d.iconKey
              const accent = accentForDisease(d.category)

              return (
                <motion.div
                  key={d.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: idx * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={`/penyakit/${d.code}`} className="group block h-full">
                    <article
                      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_50px_-18px_rgba(14,165,233,0.2)]"
                      style={{
                        boxShadow: '0 1px 0 0 rgba(255,255,255,0.7) inset, 0 10px 28px -16px rgba(15,23,42,0.16)',
                      }}
                    >
                      {/* Photo */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        {photo && (
                          <SmartImage
                            src={photo.src}
                            alt={photo.alt}
                            region={photo.region}
                            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        )}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background: 'linear-gradient(to top, rgba(5,8,20,0.55) 0%, rgba(5,8,20,0.0) 50%)',
                          }}
                          aria-hidden
                        />
                        {/* Accent top bar */}
                        <div
                          className="absolute inset-x-0 top-0 h-0.5"
                          style={{
                            background: `linear-gradient(to right, transparent, ${accent}80, transparent)`,
                            opacity: 0,
                            transition: 'opacity 0.3s',
                          }}
                        />
                        {/* ICD chip */}
                        <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-white/92 px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-ink backdrop-blur-md">
                          {d.icdCode}
                        </span>
                        {/* Anatomy badge */}
                        <span className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-white/92 backdrop-blur-md">
                          <AnatomyMini
                            region={region as 'ear' | 'nose' | 'sinus' | 'throat' | 'general'}
                            size={30}
                          />
                        </span>
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-4">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                          {d.category}
                        </p>
                        <h3 className="mt-1 font-display text-[17px] font-semibold leading-tight text-ink dark:text-white">
                          {d.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-ink-soft dark:text-slate-400">
                          {d.description}
                        </p>

                        <CFSparkline rules={rules} accent={accent} className="mt-3" />

                        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                          <span className="num font-mono text-[9px] text-muted-foreground">
                            peak cf {peak.toFixed(1)}
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium" style={{ color: accent }}>
                            Detail
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-10 max-w-2xl font-mono text-[11px] text-muted-foreground">
          Knowledge sourced from{' '}
          <span className="text-ink dark:text-slate-300">Setyaputri, K.E., Fadlil, A., & Sunardi (2018)</span>{' '}
          · Jurnal Teknik Elektro Vol. 10 No. 1 · validated by{' '}
          <span className="text-ink dark:text-slate-300">dr. M. Agus Sugicharto, Sp.THT-KL</span>.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────
// KBStat
// ─────────────────────────────────────────────────────────────────────
function KBStat({
  n,
  label,
  icon: Icon,
  color,
}: {
  n: number
  label: string
  icon: typeof Layers
  color: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      <span className="num font-display text-xl font-semibold text-ink dark:text-white">{n}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Featured disease card
// ─────────────────────────────────────────────────────────────────────
function FeaturedDiseaseCard({ disease }: { disease: (typeof DISEASES)[number] }) {
  const cardRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08])

  const rules = CF_RULES.filter((r) => r.diseaseCode === disease.code)
    .sort((a, b) => b.expertWeight - a.expertWeight)
    .slice(0, 4)
  const photo = DISEASE_PHOTO[disease.code] ?? IMG.diseaseEar
  const region = disease.iconKey
  const accent = accentForDisease(disease.category)

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300"
      style={{
        boxShadow: '0 1px 0 0 rgba(255,255,255,0.7) inset, 0 24px 60px -28px rgba(15,23,42,0.18)',
      }}
    >
      {/* Accent top stripe */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-0.5"
        style={{ background: `linear-gradient(to right, transparent, ${accent}80, transparent)` }}
      />

      {/* Hero photo */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <motion.div style={{ scale: imgScale }} className="h-full w-full">
          <SmartImage
            src={photo.src}
            alt={photo.alt}
            region={photo.region}
            imgClassName="h-full w-full object-cover"
          />
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(5,8,20,0.65) 0%, rgba(5,8,20,0.0) 50%)' }}
          aria-hidden
        />

        {/* Bottom overlay */}
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
          <div className="flex items-end gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/92 backdrop-blur-md">
              <AnatomyMini
                region={region as 'ear' | 'nose' | 'sinus' | 'throat' | 'general'}
                size={36}
              />
            </span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/75">
                Featured · {disease.category}
              </p>
              <h3 className="mt-0.5 font-display text-3xl font-medium leading-tight md:text-4xl">
                {disease.name}
              </h3>
            </div>
          </div>
          <span className="rounded-full border border-white/25 bg-white/92 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur-md">
            {disease.icdCode}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-slate-400">
          {disease.description}
        </p>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Top diagnostic symptoms
        </p>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {rules.map((r) => {
            const sym = SYMPTOM_BY_CODE[r.symptomCode]
            if (!sym) return null
            const barColor =
              r.expertWeight >= 0.8 ? '#10B981' : r.expertWeight >= 0.6 ? '#0EA5E9' : '#94A3B8'
            return (
              <div
                key={r.symptomCode}
                className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/40 px-2.5 py-1.5"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: barColor }}
                />
                <span className="num font-mono text-[9px] text-muted-foreground">{r.symptomCode}</span>
                <span className="min-w-0 flex-1 truncate text-[11px] text-ink dark:text-slate-200">
                  {sym.name}
                </span>
                <span className="num font-mono text-[9px] font-semibold text-ink dark:text-slate-200">
                  {r.expertWeight.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-5">
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-ink dark:text-slate-200">When to see a doctor: </span>
            {disease.whenToSeeDoctor}
          </p>
          <Link
            to={`/penyakit/${disease.code}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-ink-soft transition-all hover:border-primary/50 hover:text-primary dark:text-slate-400 dark:hover:text-sky-400"
          >
            Read the rules
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ─────────────────────────────────────────────────────────────────────
// CF Sparkline with accent color
// ─────────────────────────────────────────────────────────────────────
function CFSparkline({
  rules,
  accent,
  className,
}: {
  rules: Array<{ symptomCode: string; expertWeight: number }>
  accent: string
  className?: string
}) {
  return (
    <div className={cn('flex items-end gap-1', className)}>
      {rules.map((r, i) => {
        const h = 8 + r.expertWeight * 22
        const color =
          r.expertWeight >= 0.8 ? accent : r.expertWeight >= 0.6 ? `${accent}99` : '#94A3B880'
        return (
          <motion.div
            key={r.symptomCode}
            initial={{ height: 0 }}
            whileInView={{ height: h }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="w-2 rounded-sm"
            style={{ background: color }}
          />
        )
      })}
      <span className="ml-1 self-end font-mono text-[9px] text-muted-foreground">cf</span>
    </div>
  )
}
