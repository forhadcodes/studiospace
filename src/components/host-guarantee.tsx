import {
  ShieldCheckIcon,
  BadgeCheckIcon,
  WrenchIcon,
  HeadphonesIcon,
} from "lucide-react"

const guarantees = [
  {
    icon: ShieldCheckIcon,
    title: "Liability Protection",
    description:
      "Every booking is covered by built-in liability protection, so hosts and creators are safeguarded from unexpected damage claims and incidents on set.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified Profiles",
    description:
      "All hosts and creators are identity-verified before they can list or book. Ratings, reviews, and studio photos are authentic and audited.",
  },
  {
    icon: WrenchIcon,
    title: "Equipment Safety",
    description:
      "Listed gear is safety-checked and documented. If equipment arrives faulty or missing, bookings are protected with full refund support.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Host Support",
    description:
      "Our support team is available around the clock for hosts and creators — before, during, and after every single booking.",
  },
]

function HostGuarantee() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20 text-white">
      <div className="absolute -top-40 right-0 size-96 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute bottom-0 -left-20 size-80 rounded-full bg-red-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-500 uppercase">
          Booked With Confidence
        </p>
        <h2 className="mb-4 max-w-2xl text-3xl font-bold sm:text-4xl">
          Host Guarantee &amp; Creator Support
        </h2>
        <p className="mb-14 max-w-2xl text-sm text-white/60 sm:text-base">
          Your production — and your space — are protected at every step of
          the booking.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-red-600/50"
            >
              <div className="mb-5 grid size-11 place-items-center rounded-lg bg-red-600 text-white">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { HostGuarantee }
