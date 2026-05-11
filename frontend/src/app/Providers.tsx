import { useEffect } from 'react'
import { applyThemeToDocument, useThemeStore } from '@/stores/themeStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  // Ensure system preference applies on first visit if no persisted theme yet
  useEffect(() => {
    const persisted = localStorage.getItem('diagnova-theme')
    if (!persisted && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      useThemeStore.getState().setTheme('dark')
    }
  }, [])

  return <>{children}</>
}
