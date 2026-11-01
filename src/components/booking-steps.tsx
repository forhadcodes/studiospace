import {
  SearchIcon,
  ClockIcon,
  CalendarCheckIcon,
  SparklesIcon,
} from "lucide-react"

const steps = [
  {
    icon: SearchIcon,
    title: "Discover Spaces",
    description:
      "Browse verified studios by category, location, gear, and budget to find the right fit for your production.",
  },
  {
    icon: ClockIcon,
    title: "Select Shoot Hours",
    description:
      "Pick the exact hourly slots you need — half-day, full-day, or a two-hour podcast session.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book Instantly",
    description:
      "Confirm and pay in seconds. Instant booking means no quotes, no waiting, no back-and-forth.",
  },
  {
    icon: SparklesIcon,
    title: "Create & Produce",
    description:
      "Show up, set up, and create. Every studio arrives pre-lit, pre-synced, and ready to roll.",
  },
]

function BookingSteps() {
  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
          Simple By Design
        </p>
        <h2 className="mb-14 text-3xl font-bold text-neutral-900 sm:text-4xl">
          How Booking Works
        </h2>

        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connector line between steps on desktop */}
          <div
            aria-hidden="true"
            className="absolute top-6 right-[12%] left-[12%] hidden h-px border-t-2 border-dashed border-neutral-300 lg:block"
          />
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-red-600 text-xl font-bold text-white ring-4 ring-neutral-50">
                  {index + 1}
                </div>
                <Icon className="size-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export { BookingSteps }
