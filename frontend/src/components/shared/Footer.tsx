import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Github, Linkedin, Twitter } from 'lucide-react'
import { NovaMark } from './Logo'

const NAV_GROUPS = [
  {
    label: 'Produk',
    items: [
      { to: '/', label: 'Beranda' },
      { to: '/konsultasi', label: 'Konsultasi' },
      { to: '/penyakit', label: 'Knowledge Base' },
      { to: '/tentang', label: 'Metodologi' },
    ],
  },
  {
    label: 'Kapabilitas',
    items: [
      { to: '/tentang', label: 'Certainty Factor' },
      { to: '/tentang', label: 'Explainable AI' },
      { to: '/penyakit', label: 'Disease Library' },
      { to: '/konsultasi', label: 'Pre-konsultasi' },
    ],
  },
]

const REFS = [
  'Setyaputri, K.E., Fadlil, A., & Sunardi (2018) — Jurnal Teknik Elektro Vol. 10 No. 1',
  'dr. M. Agus Sugicharto, Sp.THT-KL — Sumber bobot pakar',
  'Shortliffe, E. H. (1976) — MYCIN, Stanford University.',
  'WHO ICD-10 — Classification of Diseases (2019)',
]

const SOCIALS = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-background">
      {/* Top accent gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(56,189,248,0.5) 35%, rgba(139,92,246,0.5) 65%, transparent 100%)',
        }}
      />

      {/* Subtle noise texture */}
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.03]" aria-hidden />

      <div className="container py-16">
        {/* Brand statement banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16 rounded-3xl border border-border/50 bg-gradient-to-br from-muted/60 to-muted/20 p-7 md:p-10"
        >
          <p
            className="font-display text-2xl font-medium italic leading-snug tracking-tight md:text-3xl"
            style={{ fontVariationSettings: '"opsz" 32, "SOFT" 80' }}
          >
            "From symptom to explainable diagnosis."
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Filosofi Diagnova — kepercayaan dimulai dari penjelasan, dan setiap diagnosis
            berhak ditelusuri kembali ke alasannya. Bukan kotak hitam.
          </p>

          {/* Brand tag */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {['Certainty Factor', 'ICD-10', 'Explainable AI', 'ENT Specialist'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Main footer grid */}
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              <NovaMark className="h-10 w-10" />
              <div>
                <span
                  className="block font-display text-xl font-medium tracking-tight"
                  style={{ fontVariationSettings: '"opsz" 24, "SOFT" 50' }}
                >
                  Diagnova
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  ENT Expert System
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
              Platform{' '}
              <em className="text-foreground/80">Explainable Medical Intelligence</em> untuk
              gangguan Telinga, Hidung, dan Tenggorokan. Pendamping pre-konsultasi — bukan
              pengganti dokter.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-muted-foreground backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {NAV_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {g.label}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {g.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-foreground/70 transition-colors duration-150 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* References */}
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              Referensi
            </p>
            <ul className="mt-4 space-y-2.5 text-[11px] leading-relaxed text-muted-foreground">
              {REFS.map((r) => (
                <li key={r} className="border-b border-border/30 pb-2 last:border-0 last:pb-0">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal footer */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-[11px] text-muted-foreground md:flex-row md:items-center">
          <p className="font-mono">
            © {new Date().getFullYear()} Diagnova — Educational prototype · tidak untuk penggunaan klinis
          </p>
          <p className="font-mono">
            Bukan pengganti diagnosis medis profesional oleh dokter yang kompeten.
          </p>
        </div>
      </div>
    </footer>
  )
}
