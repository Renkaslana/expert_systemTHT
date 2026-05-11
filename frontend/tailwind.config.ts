import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        sansDisplay: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // ─ Semantic surface elevations ─
        surface: {
          canvas:   'hsl(var(--surface-canvas))',
          sunken:   'hsl(var(--surface-sunken))',
          raised:   'hsl(var(--surface-raised))',
          elevated: 'hsl(var(--surface-elevated))',
          overlay:  'hsl(var(--surface-overlay))',
        },
        // ─ Semantic border weights ─
        'border-subtle':  'hsl(var(--border-subtle))',
        'border-strong':  'hsl(var(--border-strong))',
        // ─ Brand (also aliased as primary above for shadcn compatibility) ─
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          hover:   'hsl(var(--brand-hover))',
          soft:    'hsl(var(--brand-soft))',
          subtle:  'hsl(var(--brand-subtle))',
          foreground: 'hsl(var(--brand-foreground))',
        },
        // ─ Status colors ─
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger:  'hsl(var(--danger))',
        info:    'hsl(var(--info))',
        // ─ Semantic text ladder ─
        text: {
          primary:   'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          tertiary:  'hsl(var(--text-tertiary))',
          disabled:  'hsl(var(--text-disabled))',
        },
        cf: {
          'very-high': '#10B981',
          high: '#3B82F6',
          medium: '#F59E0B',
          low: '#EF4444',
        },
        // ─ Editorial ink (legacy alias) ─
        ink: {
          DEFAULT: 'hsl(var(--ink))',
          soft: 'hsl(var(--ink-soft))',
          subtle: 'hsl(var(--ink-subtle))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)',
        'aurora':
          'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.18), transparent 40%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.18), transparent 45%), radial-gradient(circle at 50% 80%, rgba(6,182,212,0.16), transparent 45%)',
        'hero-dark':
          'radial-gradient(140% 100% at 68% 0%, #0C1E3A 0%, #060C1C 45%, #03060E 100%)',
      },
      keyframes: {
        // ─ Utility animations
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // ─ Pulse / glow
        'pulse-soft': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 16px rgba(14,165,233,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(14,165,233,0.55)' },
        },
        // ─ Shimmer
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // ─ Float
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-y-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        // ─ Orbit
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // ─ Aurora
        'aurora-shift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -2%, 0) scale(1.04)' },
        },
        'aurora-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(1.5%, -1%, 0) rotate(2deg)' },
        },
        // ─ Scan
        'scan-line': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(800%)' },
        },
        'scan-y': {
          '0%': { transform: 'translateY(-110%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateY(110%)', opacity: '0' },
        },
        // ─ CF pulse trace
        'pulse-trace': {
          '0%': { offsetDistance: '0%', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { offsetDistance: '100%', opacity: '0' },
        },
        // ─ Heartbeat
        'beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.06)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.03)' },
        },
        // ─ Count up
        'count-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
        'float-y-slow': 'float-y-slow 9s ease-in-out infinite',
        'orbit': 'orbit 24s linear infinite',
        'aurora-shift': 'aurora-shift 14s ease-in-out infinite',
        'aurora-slow': 'aurora-slow 22s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'scan-y': 'scan-y 7s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'beat': 'beat 1.6s ease-in-out infinite',
        'count-up': 'count-up 0.5s ease-out forwards',
      },
      boxShadow: {
        // ─ Semantic elevation scale (theme-aware via CSS variables) ─
        'elev-xs':  'var(--shadow-xs)',
        'elev-sm':  'var(--shadow-sm)',
        'elev-md':  'var(--shadow-md)',
        'elev-lg':  'var(--shadow-lg)',
        'elev-xl':  'var(--shadow-xl)',
        'elev-2xl': 'var(--shadow-2xl)',
        // ─ Card shadows (theme-aware) ─
        'card':         'var(--shadow-card)',
        'card-hover':   'var(--shadow-card-hover)',
        'card-feature': 'var(--shadow-card-feature)',
        // ─ Brand glow (theme-aware) ─
        'glow':    'var(--glow-brand)',
        'glow-lg': 'var(--glow-brand-lg)',
        // ─ Legacy shadows (kept for existing section code) ─
        'panel-lift':
          '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px -28px rgba(2,6,23,0.55), 0 8px 20px -12px rgba(2,6,23,0.45)',
        'panel-lift-lg':
          '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 40px 100px -40px rgba(2,6,23,0.75), 0 12px 30px -16px rgba(2,6,23,0.55)',
        'panel-lift-light':
          '0 1px 0 0 rgba(255,255,255,0.85) inset, 0 24px 60px -28px rgba(15,23,42,0.18), 0 8px 20px -12px rgba(15,23,42,0.10)',
        'card-light':
          '0 1px 0 0 rgba(255,255,255,0.75) inset, 0 12px 32px -18px rgba(15,23,42,0.16)',
        // ─ Accent glows (kept) ─
        'glow-sky':
          '0 0 0 1px rgba(56,189,248,0.18), 0 12px 40px -12px rgba(56,189,248,0.45)',
        'glow-sky-lg':
          '0 0 0 1px rgba(56,189,248,0.22), 0 0 32px rgba(56,189,248,0.4), 0 20px 60px -20px rgba(56,189,248,0.35)',
        'glow-amber':
          '0 0 0 1px rgba(245,158,11,0.22), 0 12px 40px -12px rgba(245,158,11,0.40)',
        'glow-violet':
          '0 0 0 1px rgba(139,92,246,0.18), 0 12px 40px -12px rgba(139,92,246,0.40)',
        'glow-emerald':
          '0 0 0 1px rgba(52,211,153,0.18), 0 12px 40px -12px rgba(52,211,153,0.40)',
      },
      // ─ Section spacing rhythm ─
      // Use these utilities to keep section padding consistent across the app.
      // Tailwind: `py-section`, `py-section-sm`, `py-section-lg`.
      padding: {
        'section-sm': '4rem',    // 64px — compact sections
        'section':    '7rem',    // 112px — default section vertical
        'section-lg': '9rem',    // 144px — hero / feature sections
      },
      // ─ Premium easing tokens ─
      transitionTimingFunction: {
        // expo-out — the system's signature ease for entrances and motion
        'expo':   'cubic-bezier(0.22, 1, 0.36, 1)',
        // sharper expo for press / release feedback
        'snappy': 'cubic-bezier(0.4, 0, 0.2, 1)',
        // gentle bezier for hover lifts
        'gentle': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [animate],
}

export default config
