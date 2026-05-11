import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Diagnova Button — premium healthtech-grade variants.
 *
 * Variant guide:
 *   default  — solid brand cyan, primary action everywhere
 *   cta      — solid brand cyan + glow halo (hero / CTA section only)
 *   outline  — bordered, theme-aware surface
 *   ghost    — transparent, subtle hover lift
 *   subtle   — soft brand-tinted background (secondary action)
 *   glass    — frosted glass (light section overlays)
 *   glass-dark — always-dark glass (over imagery / hero)
 *   destructive — danger red
 *
 * All variants inherit consistent radius, motion, and focus rings.
 */

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap select-none',
    'rounded-xl text-sm font-semibold leading-none',
    'transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-expo',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        // ─ Primary: brand cyan, the system's main action
        default:
          'bg-brand text-brand-foreground hover:bg-brand-hover shadow-elev-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',

        // ─ CTA: brand cyan with stronger luminous halo (hero / CTA only)
        cta:
          'bg-brand text-brand-foreground hover:bg-brand-hover shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0',

        // ─ Outline: bordered, theme-aware surface
        outline:
          'border border-border bg-surface-raised text-foreground hover:bg-surface-overlay hover:border-border-strong',

        // ─ Ghost: transparent, subtle hover
        ghost:
          'text-text-secondary hover:bg-surface-sunken hover:text-text-primary',

        // ─ Subtle: soft brand-tinted bg (secondary action)
        subtle:
          'bg-brand-soft text-brand hover:bg-brand-subtle border border-transparent hover:border-brand/20',

        // ─ Glass (light): frosted, for floating UI on light sections
        glass:
          'bg-white/70 dark:bg-white/[0.04] text-foreground border border-white/40 dark:border-white/[0.07] backdrop-blur-xl hover:bg-white/85 dark:hover:bg-white/[0.08]',

        // ─ Glass-dark: ALWAYS dark — for overlays on hero / imagery
        'glass-dark':
          'border border-white/15 bg-white/[0.06] text-slate-100 backdrop-blur-md hover:border-white/25 hover:bg-white/[0.10]',

        // ─ Secondary (legacy alias)
        secondary:
          'bg-muted text-foreground hover:bg-muted/80',

        // ─ Destructive
        destructive:
          'bg-danger text-destructive-foreground hover:bg-danger/90',
      },
      size: {
        sm:      'h-9 px-3.5 text-xs',
        default: 'h-11 px-5',
        lg:      'h-12 px-7 text-base rounded-2xl',
        xl:      'h-14 px-8 text-base rounded-2xl',
        icon:    'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { buttonVariants }
