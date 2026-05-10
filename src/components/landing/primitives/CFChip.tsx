import { cn } from '@/lib/utils'

type Tone = 'dark' | 'light'

interface CFChipProps {
  code?: string
  label: string
  cf: number
  tone?: Tone
  active?: boolean
  className?: string
}

function cfColor(cf: number) {
  if (cf >= 0.8) return { ring: '#10B981', text: 'text-emerald-300', textLight: 'text-emerald-700' }
  if (cf >= 0.6) return { ring: '#38BDF8', text: 'text-sky-300', textLight: 'text-sky-700' }
  if (cf >= 0.4) return { ring: '#F59E0B', text: 'text-amber-300', textLight: 'text-amber-700' }
  return { ring: '#94A3B8', text: 'text-slate-400', textLight: 'text-slate-500' }
}

/**
 * Symptom chip used across hero panels, How-It-Works step 1, and the live demo.
 * Surface-aware (tone) so it looks right on dark cinematic backgrounds and
 * editorial light cards alike.
 */
export function CFChip({
  code,
  label,
  cf,
  tone = 'dark',
  active = true,
  className,
}: CFChipProps) {
  const { ring, text, textLight } = cfColor(cf)
  const surface =
    tone === 'dark'
      ? active
        ? 'bg-white/[0.04] border-white/[0.10] text-slate-100'
        : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
      : active
        ? 'bg-white border-slate-200 text-slate-900'
        : 'bg-slate-50 border-slate-200 text-slate-400'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs',
        surface,
        className,
      )}
    >
      <span
        className="relative inline-flex h-3.5 w-3.5 items-center justify-center"
        aria-hidden
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${ring} ${cf * 360}deg, transparent 0deg)`,
            mask: 'radial-gradient(circle, transparent 50%, black 51%)',
            WebkitMask: 'radial-gradient(circle, transparent 50%, black 51%)',
          }}
        />
        <span
          className="absolute inset-[3px] rounded-full"
          style={{ background: ring, opacity: 0.18 }}
        />
      </span>
      {code && (
        <span className="num font-mono text-[10px] text-slate-400">{code}</span>
      )}
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          'num font-mono text-[10px]',
          tone === 'dark' ? text : textLight,
        )}
      >
        {cf.toFixed(1)}
      </span>
    </div>
  )
}
