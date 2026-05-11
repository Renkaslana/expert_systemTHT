import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Diagnova typography system.
 *
 * Type scale (mobile → desktop, rem):
 *   Display  — 3.0  → 5.5  | Fraunces, medium, italic-friendly
 *   H1       — 2.5  → 4.0  | Fraunces, medium
 *   H2       — 2.0  → 3.0  | Fraunces, medium
 *   H3       — 1.375→ 1.75 | Fraunces, semibold
 *   H4       — 1.125→ 1.25 | Fraunces or Inter, semibold
 *   Lead     — 1.05 → 1.15 | Inter, regular — sub-header copy
 *   Body     — 0.9375     | Inter, regular — body text
 *   Small    — 0.8125     | Inter, medium  — captions / secondary
 *   Eyebrow  — 0.625      | JetBrains Mono, medium, uppercased, tracked
 *
 * Hierarchy is enforced via `as` for semantic HTML and `level` for visual size.
 */

/* ─────────────────────────────────────────────────────────────────
   Display (hero / CTA closer)
─────────────────────────────────────────────────────────────────*/
const displayVariants = cva(
  'font-display font-medium leading-[0.96] tracking-tight text-balance text-text-primary',
  {
    variants: {
      size: {
        xl: 'text-[clamp(46px,7vw,88px)]',
        lg: 'text-[clamp(40px,6vw,72px)]',
        md: 'text-[clamp(32px,5vw,56px)]',
      },
    },
    defaultVariants: { size: 'lg' },
  },
)

export interface DisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof displayVariants> {
  as?: 'h1' | 'h2'
}

export const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ className, size, as = 'h1', ...props }, ref) => {
    const Tag = as
    return (
      <Tag
        ref={ref}
        className={cn(displayVariants({ size }), className)}
        {...props}
      />
    )
  },
)
Display.displayName = 'Display'

/* ─────────────────────────────────────────────────────────────────
   Headings
─────────────────────────────────────────────────────────────────*/
const headingVariants = cva(
  'font-display font-medium leading-[1.05] tracking-tight text-balance text-text-primary',
  {
    variants: {
      level: {
        1: 'text-[clamp(34px,5vw,56px)] font-medium',
        2: 'text-[clamp(28px,4vw,42px)] font-medium',
        3: 'text-[clamp(22px,2.6vw,30px)] font-semibold leading-[1.15]',
        4: 'text-[clamp(18px,1.8vw,22px)] font-semibold leading-tight',
      },
    },
    defaultVariants: { level: 2 },
  },
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, as, ...props }, ref) => {
    const Tag = (as ?? `h${level}`) as 'h1' | 'h2' | 'h3' | 'h4'
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ level }), className)}
        {...props}
      />
    )
  },
)
Heading.displayName = 'Heading'

/* ─────────────────────────────────────────────────────────────────
   Lead — subheader copy under display/headings
─────────────────────────────────────────────────────────────────*/
export const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'max-w-[58ch] text-[clamp(15px,1.1vw,18px)] leading-relaxed text-text-tertiary',
      className,
    )}
    {...props}
  />
))
Lead.displayName = 'Lead'

/* ─────────────────────────────────────────────────────────────────
   Body / Small / Caption
─────────────────────────────────────────────────────────────────*/
const bodyVariants = cva('font-sans leading-relaxed', {
  variants: {
    size: {
      base:  'text-[15px] text-text-secondary',
      small: 'text-[13px] text-text-tertiary',
      tiny:  'text-[11px] text-text-tertiary',
    },
  },
  defaultVariants: { size: 'base' },
})

export interface BodyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyVariants> {
  as?: 'p' | 'span' | 'div'
}

export const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, size, as = 'p', ...props }, ref) => {
    const Tag = as
    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(bodyVariants({ size }), className)}
        {...props}
      />
    )
  },
)
Body.displayName = 'Body'

/* ─────────────────────────────────────────────────────────────────
   Eyebrow — uppercase mono pill text. Pair with EyebrowPill.
─────────────────────────────────────────────────────────────────*/
export const Eyebrow = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-text-tertiary',
      className,
    )}
    {...props}
  />
))
Eyebrow.displayName = 'Eyebrow'

/* ─────────────────────────────────────────────────────────────────
   EyebrowPill — bordered pill with optional dot indicator.
   Replaces ad-hoc `editorial-eyebrow` / `eyebrow-dark` use.
─────────────────────────────────────────────────────────────────*/
const eyebrowPillVariants = cva(
  'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] backdrop-blur-md',
  {
    variants: {
      tone: {
        light:
          'border border-border bg-surface-raised text-text-tertiary',
        dark:
          'border border-white/10 bg-white/[0.04] text-slate-300',
        brand:
          'border border-brand/20 bg-brand-soft text-brand',
      },
    },
    defaultVariants: { tone: 'light' },
  },
)

export interface EyebrowPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof eyebrowPillVariants> {
  /** Show the live dot indicator on the left. */
  live?: boolean
}

export const EyebrowPill = React.forwardRef<HTMLSpanElement, EyebrowPillProps>(
  ({ className, tone, live, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(eyebrowPillVariants({ tone }), className)}
      {...props}
    >
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      )}
      {children}
    </span>
  ),
)
EyebrowPill.displayName = 'EyebrowPill'

/* ─────────────────────────────────────────────────────────────────
   Mono — for code, CF values, ICD-10 codes
─────────────────────────────────────────────────────────────────*/
export const Mono = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'num font-mono text-[12px] tabular-nums text-text-tertiary',
      className,
    )}
    {...props}
  />
))
Mono.displayName = 'Mono'

export { displayVariants, headingVariants, bodyVariants, eyebrowPillVariants }
