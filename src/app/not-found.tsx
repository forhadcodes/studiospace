import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon, CameraIcon, SearchIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Page Not Found | StudioSpace",
  description:
    "This set is empty — the page you were looking for could not be found.",
}

/**
 * Custom 404. Served for unknown URLs and for `notFound()` calls anywhere in
 * the app (studio details, etc.). The illustration is inline SVG so it follows
 * the light/dark theme via Tailwind color utilities.
 */
export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-section px-4 py-16 sm:px-6">
      {/* Soft red glow behind the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-12 md:grid-cols-2">
        {/* Copy + actions */}
        <div>
          <p className="text-xs font-bold tracking-[0.15em] text-red-600 uppercase dark:text-red-500">
            404 · Set not found
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            This set is empty.
          </h1>
          <p className="mt-4 max-w-md text-sm/relaxed text-muted-foreground sm:text-base">
            The page you were looking for has moved, been struck from the call
            sheet, or never made it past pre-production. Let&apos;s get you back
            on set.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:ring-3 focus-visible:ring-red-600/40 focus-visible:outline-none"
            >
              <ArrowLeftIcon className="size-4" />
              Return to Home
            </Link>
            <Link
              href="/studio-explore"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <SearchIcon className="size-4 text-red-600 dark:text-red-500" />
              Explore Studios
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CameraIcon className="size-3.5" />
            Lost a listing? Head to My Studio Listings after signing in.
          </p>
        </div>

        {/* Studio illustration */}
        <div className="order-first flex justify-center md:order-last">
          <StudioIllustration />
        </div>
      </div>
    </main>
  )
}

function StudioIllustration() {
  return (
    <svg
      viewBox="0 0 520 340"
      role="img"
      aria-label="Illustration of an empty photo studio set with a camera on a tripod"
      className="h-auto w-full max-w-md"
    >
      {/* Ghost 404 behind the set */}
      <text
        x="260"
        y="248"
        textAnchor="middle"
        fontSize="180"
        fontWeight="700"
        className="fill-foreground"
        opacity="0.05"
      >
        404
      </text>

      {/* Cyclorama wall */}
      <path
        d="M112 292V132c0-38 30-68 68-68h160c38 0 68 30 68 68v160"
        className="fill-muted stroke-border"
        strokeWidth="3"
      />

      {/* Floor line */}
      <path
        d="M56 292h408"
        className="stroke-border"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Light rays from the softbox */}
      <g
        className="stroke-red-600/40"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 12"
      >
        <path d="M384 76l-58 40" />
        <path d="M394 94l-62 32" />
        <path d="M366 64l-44 44" />
      </g>

      {/* Softbox on a stand */}
      <g
        className="stroke-foreground/70"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M386 78l30-16 20 38-30 16z" className="fill-card" />
        <path d="M386 78l-6-22" />
        <path d="M406 100v168" />
        <path d="M380 292l26-24 26 24" />
      </g>

      {/* Tripod */}
      <g className="stroke-foreground/70" strokeWidth="5" strokeLinecap="round">
        <path d="M214 196l-34 96" />
        <path d="M214 196l34 96" />
        <path d="M214 196v96" />
        <path d="M172 292h84" />
      </g>

      {/* Camera body + lens */}
      <g
        className="stroke-foreground/70"
        strokeWidth="5"
        strokeLinejoin="round"
      >
        <rect
          x="174"
          y="146"
          width="80"
          height="56"
          rx="12"
          className="fill-card"
        />
        <rect
          x="230"
          y="136"
          width="18"
          height="12"
          rx="3"
          className="fill-card"
        />
        <circle cx="214" cy="174" r="18" className="fill-muted" />
        <circle cx="214" cy="174" r="6" className="fill-red-600" />
      </g>

      {/* Recording dot */}
      <circle cx="242" cy="158" r="4" className="fill-red-600" />

      {/* Sparkles */}
      <g
        className="stroke-red-600/60"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M120 74v16M112 82h16" />
        <path d="M424 214v12M418 220h12" />
        <path d="M96 210v12M90 216h12" />
      </g>
    </svg>
  )
}
