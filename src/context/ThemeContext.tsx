import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeAccent = 'blue' | 'purple' | 'cyan'

interface ThemeContextValue {
  mode: ThemeMode
  accent: ThemeAccent
  resolvedMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: ThemeAccent) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const MODE_KEY = 'pmo-theme-mode'
const ACCENT_KEY = 'pmo-theme-accent'

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(MODE_KEY) as ThemeMode) || 'light',
  )
  const [accent, setAccentState] = useState<ThemeAccent>(
    () => (localStorage.getItem(ACCENT_KEY) as ThemeAccent) || 'blue',
  )
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const resolvedMode: 'light' | 'dark' = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedMode === 'dark')
    root.setAttribute('data-accent', accent)
  }, [resolvedMode, accent])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    localStorage.setItem(MODE_KEY, next)
  }, [])

  const setAccent = useCallback((next: ThemeAccent) => {
    setAccentState(next)
    localStorage.setItem(ACCENT_KEY, next)
  }, [])

  const value = useMemo(
    () => ({ mode, accent, resolvedMode, setMode, setAccent }),
    [mode, accent, resolvedMode, setMode, setAccent],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
