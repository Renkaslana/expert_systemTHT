import { cn } from '@/lib/utils'

type Tone = 'dark' | 'light'

export interface RuleTraceProps {
  ruleId: string
  conditions: { code: string; cf: number }[]
  conclusionCode: string
  conclusionCf: number
  tone?: Tone
  active?: boolean
  className?: string
}

/**
 * Mono-styled `IF G011 (CF 0.8) ∧ G020 (CF 0.6) → P001 (CF 0.85)` row.
 * Used in Hero panel C, Explainable-AI inspector, and How-It-Works step 2.
 */
export function RuleTrace({
  ruleId,
  conditions,
  conclusionCode,
  conclusionCf,
  tone = 'dark',
  active = false,
  className,
}: RuleTraceProps) {
  const surface =
    tone === 'dark'
      ? active
        ? 'border-amber-400/30 bg-amber-400/[0.04] text-slate-100'
        : 'border-white/[0.06] bg-white/[0.02] text-slate-300'
      : active
        ? 'border-amber-400/40 bg-amber-50 text-slate-900'
        : 'border-slate-200 bg-white text-slate-700'

  const muted = tone === 'dark' ? 'text-slate-500' : 'text-slate-400'
  const accent = tone === 'dark' ? 'text-sky-300' : 'text-sky-600'
  const concl = tone === 'dark' ? 'text-emerald-300' : 'text-emerald-600'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed',
        surface,
        className,
      )}
    >
      <span className={cn('mr-1 rounded px-1.5 py-0.5 text-[10px] font-semibold', muted)}>
        {ruleId}
      </span>
      <span className={muted}>IF</span>
      {conditions.map((c, i) => (
        <span key={c.code} className="inline-flex items-center gap-1">
          {i > 0 && <span className={muted}>∧</span>}
          <span className={accent}>{c.code}</span>
          <span className={muted}>({c.cf.toFixed(1)})</span>
        </span>
      ))}
      <span className={muted}>→</span>
      <span className={concl}>{conclusionCode}</span>
      <span className={muted}>(CF</span>
      <span className={cn('num', concl)}>{conclusionCf.toFixed(2)}</span>
      <span className={muted}>)</span>
    </div>
  )
}
