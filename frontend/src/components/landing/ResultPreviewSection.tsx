import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Crown,
  HeartPulse,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { MiniConfidenceRing } from '@/components/visuals/MiniConfidenceRing'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CONTRIB = [
  { name: 'Sakit kepala', pct: 35, code: 'G014' },
  { name: 'Pilek', pct: 28, code: 'G013' },
  { name: 'Hidung mampet', pct: 22, code: 'G005' },
  { name: 'Batuk', pct: 15, code: 'G001' },
]

const RECS = [
  {
    icon: HeartPulse,
    title: 'Hidrasi & istirahat cukup',
    desc: 'Bantu tubuh mengencerkan lendir secara alami.',
    tone: 'sky',
  },
  {
    icon: Sparkles,
    title: 'Inhalasi uap hangat 10 menit',
    desc: 'Redakan tekanan sinus dan bantu drainase.',
    tone: 'violet',
  },
  {
    icon: CheckCircle2,
    title: 'Cuci hidung dengan saline',
    desc: 'Bersihkan iritan dan alergen dari rongga hidung.',
    tone: 'emerald',
  },
] as const

const TONES = {
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const

export function ResultPreviewSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 mesh-gradient-soft opacity-60" />
      <div className="container">
        <SectionHeader
          eyebrow="Result Experience"
          title={
            <>
              Bukan sekadar “mungkin Sinusitis.” —{' '}
              <span className="text-gradient">ini ringkasan klinis.</span>
            </>
          }
          subtitle="Setiap hasil diagnosis Diagnova memuat skor keyakinan, kontribusi tiap gejala, rekomendasi awal, dan panduan kapan harus ke dokter."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-sky-300/30 via-violet-300/20 to-cyan-300/30 blur-3xl dark:from-sky-500/15 dark:via-violet-500/10 dark:to-cyan-500/15" />

          <div className="glass-strong overflow-hidden rounded-[2rem] p-3">
            <div className="rounded-3xl border border-border/60 bg-background/80 p-6 md:p-8">
              {/* Top bar mock */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                    diagnova.app/hasil
                  </span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  Hasil siap
                </Badge>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                {/* Primary diagnosis */}
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6">
                  <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-500/30 blur-3xl" />
                  <Badge className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Crown className="h-3 w-3" />
                    Diagnosis Utama
                  </Badge>

                  <div className="mt-5 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
                    <MiniConfidenceRing
                      value={0.917}
                      size={160}
                      stroke={12}
                      color="#10B981"
                      label="Sangat Tinggi"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Penyakit Hidung · J32.9
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
                        Sinusitis
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Sistem mendeteksi 4 gejala yang cocok dengan profil Sinusitis
                        pada basis pengetahuan pakar.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                          to="/penyakit/P004"
                          className={cn(buttonVariants({ size: 'sm' }))}
                        >
                          Pelajari penyakit
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          to="/konsultasi"
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                          )}
                        >
                          Coba sendiri
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Gejala yang berkontribusi
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {CONTRIB.map((it, i) => (
                        <li key={it.code}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {it.code}
                              </span>
                              {it.name}
                            </span>
                            <span className="font-mono text-muted-foreground">
                              {it.pct}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${it.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }}
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-cyan-400"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Recommendations */}
                  <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Rekomendasi awal
                      </p>
                      <Badge variant="muted" className="text-[10px]">
                        Self-care
                      </Badge>
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {RECS.map((r) => (
                        <li
                          key={r.title}
                          className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3"
                        >
                          <div
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TONES[r.tone]}`}
                          >
                            <r.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-tight">{r.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {r.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* When to see doctor */}
                  <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm font-semibold">Kapan harus ke dokter?</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      Periksakan ke dokter jika gejala berlangsung &gt; 10 hari, demam
                      tinggi, nyeri wajah hebat, atau pembengkakan di sekitar mata.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Pre-konsultasi untuk dokter spesialis THT
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="leading-relaxed">
                      Hasil bersifat indikatif. Diagnova melengkapi — bukan menggantikan —
                      pemeriksaan dokter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
