"use client"

import { useEffect, type ReactNode } from "react"

/**
 * Theme handling without a third-party dependency:
 *
 * - `THEME_SCRIPT` runs before the first paint (inlined in the root layout) so
 *   a dark-mode visitor never sees a white flash.
 * - The preference is stored in localStorage as `light` | `dark` | `system`.
 * - "system" follows `prefers-color-scheme` and keeps following it until the
 *   user explicitly picks a theme with the toggle.
 */

export const THEME_STORAGE_KEY = "studiospace-theme"

export type ResolvedTheme = "light" | "dark"
export type ThemePreference = ResolvedTheme | "system"

/** Inlined in <body> before any content renders — keep it dependency-free. */
export const THEME_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k),d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches),r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function getStoredTheme(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === "light" || stored === "dark" ? stored : "system"
  } catch {
    return "system"
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference
  return systemPrefersDark() ? "dark" : "light"
}

/** Applies the resolved theme to <html> (class + native color scheme). */
export function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function setTheme(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Private mode / storage disabled — the visual change still applies.
  }
  applyTheme(resolveTheme(preference))
}

/** Switches light ↔ dark and remembers the choice. */
export function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark")
  setTheme(isDark ? "light" : "dark")
}

/**
 * Keeps the document in sync with the OS setting (while the preference is
 * "system") and with toggles made in other tabs.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    const onSystemChange = () => {
      if (getStoredTheme() === "system") applyTheme(resolveTheme("system"))
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        applyTheme(resolveTheme(getStoredTheme()))
      }
    }

    media.addEventListener("change", onSystemChange)
    window.addEventListener("storage", onStorage)

    return () => {
      media.removeEventListener("change", onSystemChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  return children
}
