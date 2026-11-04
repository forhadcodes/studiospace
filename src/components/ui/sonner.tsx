"use client"

import { useEffect, useState } from "react"
import { Toaster as SonnerToaster } from "sonner"

type Theme = "light" | "dark"

/**
 * App-wide toast host (Sonner).
 *
 * The app theme is a class on <html> (see theme-provider.tsx) rather than a
 * `next-themes` context, so the toaster watches that class to keep its palette
 * in sync when the user flips light ↔ dark.
 */
function Toaster() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const root = document.documentElement
    const sync = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light")

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      gap={10}
      offset={20}
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  )
}

export { Toaster }
