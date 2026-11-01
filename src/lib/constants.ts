/** Canonical category slugs — single source of truth used by forms, filters, cards and badges. */
export const CATEGORY_SLUGS = [
  "photo-studio",
  "film-stage",
  "podcast-lounge",
  "music-suite",
  "workshop",
] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  "photo-studio": "Photo Studios",
  "film-stage": "Sound & Film Stages",
  "podcast-lounge": "Podcast Rooms",
  "music-suite": "Music Suites",
  workshop: "Art Workshops",
}

/** The label used in the Add/Edit Studio form's select */
export const CATEGORY_FORM_LABELS: Record<CategorySlug, string> = {
  "photo-studio": "Photo Studio",
  "film-stage": "Film Stage",
  "podcast-lounge": "Podcast Lounge",
  "music-suite": "Music Suite",
  workshop: "Workshop",
}

export function isCategorySlug(value: unknown): value is CategorySlug {
  return (
    typeof value === "string" &&
    CATEGORY_SLUGS.includes(value as CategorySlug)
  )
}

export function categoryLabel(slug: string): string {
  return isCategorySlug(slug) ? CATEGORY_LABELS[slug] : slug
}
