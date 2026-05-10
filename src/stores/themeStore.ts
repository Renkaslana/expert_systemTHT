import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggle: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setTheme: (theme) => set({ theme }),
    }),
    // Brand renamed from ClaraTHT → Diagnova; old key 'claratht-theme' is harmless if left in storage.
    { name: 'diagnova-theme' },
  ),
)

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}
