import { create } from 'zustand'
import type { DiagnosisResult } from '@/types'

export type AreaFilter = 'all' | 'telinga' | 'hidung' | 'tenggorokan' | 'umum'

interface ConsultationStore {
  selectedSymptoms: Map<string, number>
  activeFilter: AreaFilter
  result: DiagnosisResult[] | null
  startedAt: Date | null
  setSymptomWeight: (code: string, weight: number) => void
  removeSymptom: (code: string) => void
  setFilter: (filter: AreaFilter) => void
  setResult: (r: DiagnosisResult[]) => void
  reset: () => void
  start: () => void
}

export const useConsultationStore = create<ConsultationStore>((set, get) => ({
  selectedSymptoms: new Map(),
  activeFilter: 'all',
  result: null,
  startedAt: null,

  setSymptomWeight: (code, weight) => {
    const next = new Map(get().selectedSymptoms)
    if (weight === 0) next.delete(code)
    else next.set(code, weight)
    set({ selectedSymptoms: next })
  },

  removeSymptom: (code) => {
    const next = new Map(get().selectedSymptoms)
    next.delete(code)
    set({ selectedSymptoms: next })
  },

  setFilter: (filter) => set({ activeFilter: filter }),
  setResult: (result) => set({ result }),
  start: () => set({ startedAt: new Date() }),
  reset: () =>
    set({
      selectedSymptoms: new Map(),
      activeFilter: 'all',
      result: null,
      startedAt: null,
    }),
}))
