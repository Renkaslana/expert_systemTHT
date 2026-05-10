import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Activity, ArrowRight, Menu, Sparkles, X } from 'lucide-react'
import { NovaMark } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/penyakit', label: 'Basis Penyakit', end: false },
  { to: '/tentang', label: 'Metodologi', end: false },
]

export function Navbar() {
  const location = useLocation()
  const showCTA = location.pathname !== '/konsultasi'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)
  const [visible, setVisible] = useState(true)

  const { scrollYProgress } = useScroll()
  const accentOpacity = useTransform(scrollYProgress, [0, 0.04, 1], [0, 1, 1])
  const accentWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // Hide on fast scroll down, show on scroll up
      if (y > 80) {
        setVisible(y < lastY.current || y < 120)
      } else {
        setVisible(true)
      }
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 z-50 w-full transition-[background,border-color,box-shadow] duration-300',
          scrolled
            ? 'border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
            : 'border-b border-transparent bg-transparent',
        )}
        aria-label="Site navigation"
      >
        <div className="container flex h-[68px] items-center justify-between gap-6">
          {/* ── Brand ── */}
          <Link
            to="/"
            aria-label="Diagnova — Beranda"
            className="group inline-flex items-center gap-3"
          >
            <NovaMark className="h-9 w-9 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'font-display text-[22px] font-semibold leading-none tracking-[-0.025em] transition-colors duration-200',
                  'text-foreground',
                )}
                style={{
                  fontVariationSettings: '"opsz" 24, "SOFT" 30',
                }}
              >
                Diagnova
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[9px] font-medium uppercase leading-none tracking-[0.2em] transition-colors',
                  'bg-primary/10 text-primary border border-primary/20',
                  'dark:bg-sky-400/10 dark:text-sky-400 dark:border-sky-400/20'
                )}
              >
                ENT · AI
              </span>
            </div>
          </Link>

          {/* ── Nav links (desktop) ── */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-200',
                    isActive
                      ? 'text-foreground bg-foreground/[0.05] dark:text-white dark:bg-white/[0.06]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.05]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className={cn(
                          'absolute inset-x-3 -bottom-[3px] h-px rounded-full',
                          'bg-gradient-to-r from-transparent via-primary to-transparent dark:via-sky-400',
                        )}
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Right cluster ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {showCTA && (
              <Link
                to="/konsultasi"
                className={cn(
                  'hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold',
                  'transition-all duration-200',
                  buttonVariants({ size: 'sm' }),
                  'dark:bg-sky-500 dark:text-white dark:hover:bg-sky-400 dark:shadow-[0_0_20px_rgba(14,165,233,0.4)]'
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Konsultasi
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                'md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
                'border-border bg-background text-foreground hover:bg-muted',
                'dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]'
              )}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Progress accent hairline ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden"
          style={{ opacity: accentOpacity }}
        >
          <motion.div
            className="h-full"
            style={{
              width: accentWidth,
              background:
                'linear-gradient(to right, transparent 0%, rgba(56,189,248,0.7) 50%, transparent 100%)',
            }}
          />
        </motion.div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <motion.div
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, y: mobileOpen ? 0 : -8 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-[68px] z-40 md:hidden',
          'bg-background/95 backdrop-blur-2xl border-b border-border/60',
          'shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]',
          'dark:bg-[rgba(4,7,18,0.95)] dark:border-white/[0.06]',
          'dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                  isActive
                    ? 'bg-foreground/[0.06] text-foreground dark:bg-white/[0.08] dark:text-white'
                    : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {showCTA && (
            <Link
              to="/konsultasi"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white"
            >
              <Activity className="h-4 w-4" />
              Mulai Konsultasi
            </Link>
          )}
        </nav>
      </motion.div>

      {/* Spacer so content isn't hidden behind fixed navbar */}
      <div className="h-[68px]" aria-hidden />
    </>
  )
}
