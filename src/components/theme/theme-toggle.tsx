"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { toggleTheme } from "@/components/theme/theme-provider"

/**
 * Light ↔ dark switch. The icons are swapped with CSS (`dark:` variants), so
 * the button renders identically on the server and the client — no hydration
 * mismatch while the inline theme script applies the stored preference.
 */
export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string
  showLabel?: boolean
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={showLabel ? "sm" : "icon-sm"}
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      className={cn("relative", showLabel && "w-full justify-start gap-2", className)}
    >
      <span className="relative grid size-5 shrink-0 place-items-center">
        <SunIcon className="size-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </span>
      {showLabel && <span>Toggle theme</span>}
    </Button>
  )
}
