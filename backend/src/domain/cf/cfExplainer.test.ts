/**
 * CF Explainer — unit tests.
 */
import { describe, it, expect } from 'vitest'
import { buildExplanation, formatIterationFormula } from './cfExplainer.js'

describe('buildExplanation', () => {
  it('produces full sentence with confidence level + top 3 symptoms', () => {
    const out = buildExplanation('Otitis Media Akut', 'very_high', [
      'Telinga nyeri',
      'Pendengaran berkurang',
      'Demam',
    ])
    expect(out).toContain('Otitis Media Akut')
    expect(out).toContain('sangat tinggi')
    expect(out).toContain('Telinga nyeri')
    expect(out).toContain('Pendengaran berkurang')
    expect(out).toContain('Demam')
  })

  it('uses correct Indonesian phrasing per confidence level', () => {
    expect(buildExplanation('X', 'very_high', ['a'])).toContain('sangat tinggi')
    expect(buildExplanation('X', 'high', ['a'])).toContain('tinggi')
    expect(buildExplanation('X', 'medium', ['a'])).toContain('cukup')
    expect(buildExplanation('X', 'low', ['a'])).toContain('rendah')
  })

  it('limits to top 3 symptoms even if more provided', () => {
    const out = buildExplanation('X', 'high', [
      'Telinga nyeri',
      'Pendengaran berkurang',
      'Demam',
      'Tinnitus tinggi',
      'Pilek encer',
    ])
    expect(out).toContain('Telinga nyeri, Pendengaran berkurang, Demam')
    // Items beyond top 3 must not appear
    expect(out).not.toContain('Tinnitus tinggi')
    expect(out).not.toContain('Pilek encer')
  })

  it('handles single contributing symptom', () => {
    const out = buildExplanation('X', 'high', ['Telinga nyeri'])
    expect(out).toContain('Telinga nyeri')
    expect(out).toContain('Gejala paling berkontribusi')
  })

  it('falls back gracefully when no symptoms provided', () => {
    const out = buildExplanation('X', 'low', [])
    expect(out).toContain('X')
    expect(out).toContain('rendah')
    expect(out).not.toContain('berkontribusi')
  })
})

describe('formatIterationFormula', () => {
  it('matches journal notation with 3 decimals', () => {
    expect(formatIterationFormula(0.48, 0.24, 0.6048)).toBe(
      '0.480 + 0.240 × (1 − 0.480) = 0.605',
    )
  })

  it('handles zero-padded values correctly', () => {
    expect(formatIterationFormula(0.5, 0.5, 0.75)).toBe(
      '0.500 + 0.500 × (1 − 0.500) = 0.750',
    )
  })
})
