import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Unified Card system for Diagnova.
 *
 * Usage:
 *   <Card>          → default surface card on canvas
 *   <Card variant="feature">  → larger shadow, elevated surface
 *   <Card variant="outline">  → border-only, flat
 *   <Card variant="sunken">   → recessed inner panel
 *   <Card variant="glass">    → frosted glass (over imagery)
 *   <Card variant="dark-panel"> → always-dark overlay panel (over images)
 *
 * All variants are theme-aware via CSS variables in `index.css`.
 * Sub-components (CardHeader/Title/Description/Content/Footer) compose
 * into a consistent rhythm.
 */

const cardVariants = cva(
  'relative isolate rounded-2xl transition-[transform,box-shadow,border-color] duration-300 ease-expo',
  {
    variants: {
      variant: {
        default:
          'bg-surface-raised border border-border-subtle shadow-card',
        feature:
          'bg-surface-elevated border border-border-subtle shadow-card-feature',
        outline:
          'bg-surface-raised border border-border',
        sunken:
          'bg-surface-sunken border border-border-subtle',
        ghost: '',
        glass:
          'bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/40 dark:border-white/[0.07] shadow-card',
        // Always dark — for overlays on imagery / hero floating panels
        'dark-panel':
          'border border-white/[0.08] bg-[rgba(6,10,22,0.82)] backdrop-blur-xl text-slate-100 shadow-panel-lift',
      },
      interactive: {
        true: 'hover:-translate-y-1 hover:shadow-card-hover hover:border-border focus-within:shadow-card-hover',
        false: '',
      },
      padding: {
        none: '',
        sm:   'p-4',
        md:   'p-6',
        lg:   'p-8',
      },
      radius: {
        sm:   'rounded-xl',
        md:   'rounded-2xl',
        lg:   'rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
      padding: 'none',
      radius: 'md',
    },
  },
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, padding, radius, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, interactive, padding, radius }),
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

/* ─────────────────────────────────────────────────────────────────────
   Sub-components — consistent typography & rhythm
─────────────────────────────────────────────────────────────────────*/

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display text-lg font-semibold tracking-tight text-text-primary',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardEyebrow = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-text-tertiary',
      className,
    )}
    {...props}
  />
))
CardEyebrow.displayName = 'CardEyebrow'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm leading-relaxed text-text-tertiary', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

/**
 * Hairline divider that respects theme. Use inside cards to separate
 * content sections instead of raw `<hr>` or `border-t`.
 */
export const CardDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mx-6 h-px bg-border-subtle', className)}
    {...props}
  />
))
CardDivider.displayName = 'CardDivider'

export { cardVariants }
