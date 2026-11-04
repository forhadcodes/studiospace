import { Aperture } from "lucide-react"
import { cn } from "cn"

/**
 * Branded loading indicator: the StudioSpace aperture inside a spinning red
 * ring with a soft pulse. Used for route transitions (loading.tsx files) and
 * inline async states.
 */
export function BrandLoader({
  label = "Loading…",
  hint,
  className,
}: {
  label?: string
  hint?: string
  className?: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-16",
        className,
      )}
    >
      <div className="relative grid size-16 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-red-600/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-red-600/20 border-t-red-600" />
        <Aperture className="size-7 text-red-600 dark:text-red-500" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-semibold tracking-wide text-foreground">
          {label}
        </p>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
