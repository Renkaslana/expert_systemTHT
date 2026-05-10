import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ConfidenceLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 5-level CF weights from Setyaputri, K.E., Fadlil, A., & Sunardi (2018),
 * Jurnal Teknik Elektro Vol. 10 No. 1. Used by the consultation flow
 * (label-only — numerical weights kept internal) and by the landing-page
 * diagnosis demo (which intentionally surfaces the math as an explainer).
 */
export const CF_WEIGHT_OPTIONS = [
  { value: 0.2, label: 'Ragu-ragu', short: '0.2' },
  { value: 0.4, label: 'Mungkin', short: '0.4' },
  { value: 0.6, label: 'Sangat Mungkin', short: '0.6' },
  { value: 0.8, label: 'Hampir Pasti', short: '0.8' },
  { value: 1.0, label: 'Pasti', short: '1.0' },
] as const

/**
 * Default CF weight applied when a user taps a symptom card without
 * explicitly choosing an intensity. 0.6 = "Sangat Mungkin" — middle of
 * the journal scale, the natural baseline for "I clearly feel this".
 *
 * IMPORTANT: This MUST be one of the five PRD-allowed values
 * (0.2 | 0.4 | 0.6 | 0.8 | 1.0). The backend rejects anything else
 * with a VALIDATION_ERROR (PRD §6, line 605).
 */
export const DEFAULT_CF_WEIGHT = 0.6 as const

/**
 * Severity → hex mapping. Used as a small clinical color cue (severity
 * dot) in places where we want to convey severity without text labels.
 */
export const SEVERITY_HEX = {
  low:    '#10B981', // emerald
  medium: '#F59E0B', // amber
  high:   '#F43F5E', // rose
} as const

export function confidenceColor(level: ConfidenceLevel) {
  switch (level) {
    case 'very_high':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        hex: '#10B981',
        label: 'Sangat Tinggi',
      }
    case 'high':
      return {
        bg: 'bg-sky-500/10 dark:bg-sky-400/10',
        text: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-500/30',
        hex: '#3B82F6',
        label: 'Tinggi',
      }
    case 'medium':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-400/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        hex: '#F59E0B',
        label: 'Cukup',
      }
    default:
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-400/10',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        hex: '#EF4444',
        label: 'Rendah',
      }
  }
}

export function formatTimestamp(date: Date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
