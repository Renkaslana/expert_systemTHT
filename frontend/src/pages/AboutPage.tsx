import { motion } from 'framer-motion'
import { BookOpen, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { AnatomyCenterpiece } from '@/components/visuals/AnatomyCenterpiece'
import { cn } from '@/lib/utils'

const STATS = [
  { v: '24', l: 'Gejala terverifikasi', sub: 'G001 – G024' },
  { v: '5', l: 'Penyakit · ICD-10', sub: 'OMA · Serumen · OE · Sinusitis · Rhinitis' },
  { v: '1', l: 'Sumber pakar', sub: 'dr. M. Agus Sugicharto, Sp.THT-KL' },
]

export function AboutPage() {
  return (
    <PageShell withAurora>
      <div className="container max-w-5xl py-12 md:py-16">
        {/* Editorial hero */}
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge variant="secondary">Tentang Diagnova</Badge>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl"
            >
              Sistem pakar yang transparan untuk{' '}
              <span className="text-gradient">setiap orang.</span>
            </motion.h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Diagnova mengadaptasi pendekatan klasik <em>Certainty Factor</em> dari
              sistem MYCIN dan menggabungkannya dengan bahasa visual modern healthtech.
              Tujuannya satu — agar setiap pengguna bisa memahami alasan di balik
              setiap kesimpulan diagnosis, bukan sekadar menerima hasilnya.
            </p>

            {/* Stat tiles */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-4"
                >
                  <p className="font-display text-2xl font-bold tracking-tight">{s.v}</p>
                  <p className="mt-1 text-[11px] font-medium text-foreground">{s.l}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
                    {s.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Anatomy centerpiece — same primitive as the landing hero, scaled */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[420px]"
          >
            <AnatomyCenterpiece />
          </motion.div>
        </div>

        {/* Pillar cards */}
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-2 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold">
                Inferensi yang dijelaskan
              </h3>
              <p className="text-sm text-muted-foreground">
                Setiap hasil disertai langkah perhitungan combine CF, kontribusi
                gejala, dan tingkat keyakinan numerik.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold">Bersumber pakar</h3>
              <p className="text-sm text-muted-foreground">
                Bobot setiap aturan berasal dari dr. M. Agus Sugicharto, Sp.THT-KL,
                yang telah dipublikasikan di jurnal ilmiah.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold">Desain manusiawi</h3>
              <p className="text-sm text-muted-foreground">
                Bukan form skripsi — antarmuka diracik agar terasa seperti aplikasi
                kesehatan modern: tenang, ramah, dan mudah dipahami.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold">Referensi terbuka</h3>
              <p className="text-sm text-muted-foreground">
                Setyaputri, Fadlil &amp; Sunardi (2018), Jurnal Teknik Elektro
                Universitas Ahmad Dahlan, Vol. 10 No. 1.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <span className="editorial-eyebrow !text-[10px]">Metodologi</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Bagaimana Diagnova menghitung diagnosis
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Sistem mengadaptasi metode <em>Certainty Factor</em> dari MYCIN.
              Untuk setiap gejala yang Anda pilih, sistem mengalikan tingkat
              keyakinan Anda dengan bobot pakar yang telah diverifikasi, lalu
              menggabungkan nilai-nilai tersebut secara iteratif untuk
              menghasilkan keyakinan akhir tiap penyakit.
            </p>

            {/* Formula + 5-level table — 2 columns on md+ */}
            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">

              {/* Formula */}
              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Formula
                </p>
                <pre className="overflow-x-auto rounded-xl bg-slate-900/95 p-4 font-mono text-[12px] leading-relaxed text-slate-100 dark:bg-slate-100/95 dark:text-slate-900">
{`CF(gejala)    = w_user × w_pakar
CF(combined)  = CF₁ + CF₂ × (1 − CF₁)`}
                </pre>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Kombinasi dijalankan iteratif untuk seluruh gejala yang dipilih.
                  Hasil dengan CF &lt; 0.1 disaring otomatis; tiga kandidat
                  teratas ditampilkan beserta breakdown perhitungannya pada
                  halaman hasil.
                </p>
              </div>

              {/* 5-level reference table */}
              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Skala tingkat keyakinan pengguna
                </p>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Label
                        </th>
                        <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Bobot
                        </th>
                        <th className="hidden px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                          Interpretasi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { l: 'Ragu-ragu',      w: '0.2', i: 'Sedikit merasakan; bisa salah persepsi' },
                        { l: 'Mungkin',        w: '0.4', i: 'Cukup merasakan tapi tidak yakin' },
                        { l: 'Sangat Mungkin', w: '0.6', i: 'Jelas merasakan — default sistem' },
                        { l: 'Hampir Pasti',   w: '0.8', i: 'Sangat jelas; hampir tanpa ragu' },
                        { l: 'Pasti',          w: '1.0', i: '100% yakin merasakan' },
                      ].map((row, idx, arr) => (
                        <tr
                          key={row.w}
                          className={cn(
                            idx < arr.length - 1 && 'border-b border-border/60',
                            row.w === '0.6' && 'bg-sky-500/[0.04]',
                          )}
                        >
                          <td className="px-3 py-2 font-medium">{row.l}</td>
                          <td className="px-3 py-2 text-right font-mono text-sm">
                            {row.w}
                          </td>
                          <td className="hidden px-3 py-2 text-xs text-muted-foreground sm:table-cell">
                            {row.i}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Source footnote */}
            <p className="mt-6 border-t border-border/60 pt-4 text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Sumber skala:</span>{' '}
              Setyaputri, K.E., Fadlil, A., &amp; Sunardi (2018).{' '}
              <em>
                Analisis Metode Certainty Factor pada Sistem Pakar Diagnosa
                Penyakit THT
              </em>
              . Jurnal Teknik Elektro Vol. 10 No. 1, hal. 30–35.{' '}
              <span className="font-medium text-foreground">Bobot pakar</span>{' '}
              diverifikasi oleh dr. M. Agus Sugicharto, Sp.THT-KL.
            </p>
          </CardContent>
        </Card>

        <div className="mt-10">
          <MedicalDisclaimer variant="banner" />
        </div>
      </div>
    </PageShell>
  )
}
