import type { LucideIcon } from "lucide-react"
import { cn } from "cn"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

/**
 * Friendly empty state used for zero search results, empty booking lists and
 * empty listing collections. Renders an icon, title, description and any CTA
 * buttons passed as children (usually <Link> / <Button> elements).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Empty
      className={cn(
        "rounded-2xl border border-dashed border-border bg-card py-14",
        className,
      )}
    >
      <EmptyHeader className="max-w-md">
        <EmptyMedia
          variant="default"
          className="mb-3 grid size-16 place-items-center rounded-2xl bg-red-600/10"
        >
          <Icon className="size-8 text-red-600 dark:text-red-500" />
        </EmptyMedia>
        <EmptyTitle className="text-xl font-semibold text-foreground">
          {title}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      {children ? (
        <EmptyContent className="mt-2 flex-row flex-wrap justify-center gap-3">
          {children}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
