import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Region = 'ear' | 'sinus' | 'throat' | 'workspace' | 'research'

interface SmartImageProps {
  src: string
  alt: string
  /** What kind of fallback composition to render if the photo URL fails. */
  region?: Region
  className?: string
  imgClassName?: string
  /** Eager-load (use only for the LCP hero image). */
  priority?: boolean
}

/**
 * Image with a graceful, on-brand fallback. If the URL 404s or hangs, we
 * render a layered gradient + region-themed SVG composition so the page never
 * shows a broken-image icon or empty grey box.
 */
export function SmartImage({
  src,
  alt,
  region = 'workspace',
  className,
  imgClassName,
  priority = false,
}: SmartImageProps) {
  const [state, setState] = useState<'pending' | 'loaded' | 'failed'>('pending')

  // Reset state when src changes (theme switch, etc.).
  useEffect(() => {
    setState('pending')
  }, [src])

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      {/* Always render the gradient skeleton underneath — also serves as
          the fallback if the photo fails to load. */}
      <RegionFallback region={region} />

      {state !== 'failed' && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            state === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}

function RegionFallback({ region }: { region: Region }) {
  const palette = {
    ear: { a: '#0EA5E9', b: '#8B5CF6', c: '#06B6D4' },
    sinus: { a: '#A78BFA', b: '#F472B6', c: '#38BDF8' },
    throat: { a: '#06B6D4', b: '#0EA5E9', c: '#34D399' },
    workspace: { a: '#1E293B', b: '#0EA5E9', c: '#A78BFA' },
    research: { a: '#0F172A', b: '#06B6D4', c: '#F59E0B' },
  }[region]

  return (
    <div
      className="absolute inset-0"
      aria-hidden
      style={{
        background: `radial-gradient(120% 80% at 30% 20%, ${palette.a}cc 0%, transparent 50%),
                    radial-gradient(120% 80% at 80% 80%, ${palette.b}aa 0%, transparent 55%),
                    linear-gradient(140deg, #0B1220 0%, #03060D 100%)`,
      }}
    >
      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      {/* ENT-flavored decorative SVG */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="rf-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.a} stopOpacity="0.6" />
            <stop offset="100%" stopColor={palette.b} stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="rf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.c} stopOpacity="0.55" />
            <stop offset="100%" stopColor={palette.c} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="540" cy="300" r="220" fill="url(#rf-glow)" />
        {[140, 180, 240, 300, 360].map((r) => (
          <circle
            key={r}
            cx="540"
            cy="300"
            r={r}
            stroke="url(#rf-stroke)"
            strokeOpacity="0.25"
            strokeWidth="1"
            fill="none"
          />
        ))}
        <path
          d="M 240 300 C 280 240, 360 220, 410 250 C 450 274, 458 320, 432 354 C 410 384, 360 388, 332 360 C 312 340, 312 318, 292 308 C 274 300, 256 308, 240 300 Z"
          stroke="url(#rf-stroke)"
          strokeWidth="1.4"
          fill="none"
          opacity="0.55"
        />
      </svg>
    </div>
  )
}
