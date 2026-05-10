import { motion } from 'framer-motion'
import {
  BrainCircuit,
  Sparkles,
  Stethoscope,
  Database,
  Trophy,
  HeartPulse,
} from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { MiniConfidenceRing } from '@/components/visuals/MiniConfidenceRing'
import { Soundwave } from '@/components/visuals/Soundwave'

export function FeatureBento() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <SectionHeader
          eyebrow="Capabilities"
          title={
            <>
              Bukan symptom checker biasa —{' '}
              <span className="text-gradient">asisten medis cerdas.</span>
            </>
          }
          subtitle="Diagnova memadukan reasoning berbasis pengetahuan, perhitungan keyakinan, dan visualisasi yang mudah dipahami dalam satu pengalaman."
        />

        <div className="mt-14 grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
          {/* Big card — Certainty Factor */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="glass-card group relative overflow-hidden p-6 md:col-span-4 md:row-span-2"
          >
            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/30 to-violet-500/30 blur-3xl" />
            <div className="flex items-center justify-between">
              <span className="editorial-eyebrow !text-[10px]">
                <BrainCircuit className="h-3 w-3 text-violet-500" />
                Inference Engine
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">CF · 0.917</span>
            </div>

            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Certainty Factor yang transparan
            </h3>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Adaptasi metode klasik MYCIN — bobot pengguna dikalikan bobot pakar,
              lalu dikombinasikan iteratif. Hasil akhir dapat ditelusuri ke setiap
              gejala sumber.
            </p>

            <div className="mt-8 flex items-end gap-6">
              <MiniConfidenceRing
                value={0.917}
                size={120}
                stroke={10}
                color="#10B981"
                label="Sinusitis"
              />
              <div className="flex-1 space-y-2">
                {[
                  { n: 'cf₀ — sakit kepala', v: 0.6 },
                  { n: 'cf₁ — pilek', v: 0.794 },
                  { n: 'cf₂ — hidung mampet', v: 0.917, top: true },
                ].map((it, i) => (
                  <div key={it.n} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{it.n}</span>
                      <span className={`font-mono ${it.top ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {it.v.toFixed(3)}
                      </span>
                    </div>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${it.v * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          it.top
                            ? 'bg-gradient-to-r from-emerald-400 to-cyan-500'
                            : 'bg-gradient-to-r from-sky-500 to-violet-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Explainability */}
          <FeatureCard
            icon={Sparkles}
            iconBg="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            title="Explainable Diagnosis"
            desc="Setiap kesimpulan disertai jejak iterasi CF, kontribusi gejala, dan tingkat keyakinan numerik."
            className="md:col-span-2"
            delay={0.05}
          >
            <div className="mt-4 rounded-lg border border-border/60 bg-background/60 p-3">
              <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                cf₁ + cf₂·(1 − cf₁)
              </p>
              <p className="font-mono text-[10px] leading-relaxed text-emerald-600 dark:text-emerald-400">
                = 0.794 + 0.48·(1 − 0.794)
              </p>
              <p className="mt-1 font-mono text-[10px] font-semibold leading-relaxed">
                = 0.917 ✓
              </p>
            </div>
          </FeatureCard>

          {/* Symptom consultation */}
          <FeatureCard
            icon={Stethoscope}
            iconBg="bg-sky-500/10 text-sky-600 dark:text-sky-400"
            title="Konsultasi Terstruktur"
            desc="24 gejala THT dengan 5 tingkat keyakinan, dikelompokkan per area."
            className="md:col-span-2"
            delay={0.1}
          >
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['Telinga', 'Hidung', 'Tenggorokan', 'Umum'].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </FeatureCard>

          {/* Knowledge base */}
          <FeatureCard
            icon={Database}
            iconBg="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            title="Knowledge Base"
            desc="5 penyakit THT dengan ICD-10, divalidasi pakar dan jurnal ilmiah."
            className="md:col-span-2"
            delay={0.15}
          >
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {['H66.0', 'H61.2', 'H60.9', 'J32.9', 'J31.0'].map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-border/60 bg-background/60 py-1 text-center font-mono text-[10px] text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </FeatureCard>

          {/* Diagnosis ranking */}
          <FeatureCard
            icon={Trophy}
            iconBg="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            title="Diagnosis Ranking"
            desc="Top 3 kandidat penyakit dengan CF ≥ 0.1, terurut dari paling meyakinkan."
            className="md:col-span-2"
            delay={0.2}
          >
            <div className="mt-4 flex items-center gap-2">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className="flex h-7 flex-1 items-center justify-center rounded-md border border-border/60 bg-background/60 font-mono text-[10px] font-semibold"
                >
                  #{r}
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Health recommendations */}
          <FeatureCard
            icon={HeartPulse}
            iconBg="bg-rose-500/10 text-rose-600 dark:text-rose-400"
            title="Rekomendasi Kesehatan"
            desc='Saran penanganan, gejala umum, dan pertanda "kapan harus ke dokter".'
            className="md:col-span-2"
            delay={0.25}
          >
            <Soundwave bars={20} className="mt-4 h-7" variant="gradient" />
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: typeof BrainCircuit
  iconBg: string
  title: string
  desc: string
  className?: string
  delay?: number
  children?: React.ReactNode
}

function FeatureCard({
  icon: Icon,
  iconBg,
  title,
  desc,
  className = '',
  delay = 0,
  children,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay }}
      className={`glass-card group relative overflow-hidden p-5 transition-transform hover:-translate-y-1 ${className}`}
    >
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold leading-tight">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      {children}
    </motion.div>
  )
}
