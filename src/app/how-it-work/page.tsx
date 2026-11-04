import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CameraIcon,
  CheckIcon,
  CreditCardIcon,
  DollarSignIcon,
  HeadphonesIcon,
  MapPinIcon,
  PlusSquareIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { HowItWorksFaq } from "@/components/how-it-works-faq"

export const metadata: Metadata = {
  title: "How It Works | StudioSpace",
  description:
    "Learn how StudioSpace works — creators book verified photo, film, podcast, music and workshop spaces by the hour, and hosts turn their spaces into booked calendars.",
}

const creatorSteps = [
  {
    icon: SearchIcon,
    title: "Explore verified studios",
    description:
      "Browse professional spaces by category, city, capacity and amenities — with the hourly rate and deposit visible on every listing.",
    points: [
      "Filter by photo, film, podcast, music or workshop",
      "Compare rates, photos and house details",
    ],
  },
  {
    icon: CalendarDaysIcon,
    title: "Choose your shoot date",
    description:
      "Open the studio you love, check what is included, then pick the date that fits your production schedule.",
    points: [
      "Real photos, amenities and capacity up front",
      "Address and house rules before you commit",
    ],
  },
  {
    icon: CreditCardIcon,
    title: "Book and pay securely",
    description:
      "Sign in, confirm your session, and pay the hourly rate plus any refundable security deposit — all shown before checkout.",
    points: [
      "Instant confirmation, no quotes or waiting",
      "Every booking saved in My Bookings",
    ],
  },
  {
    icon: SparklesIcon,
    title: "Show up and create",
    description:
      "Arrive to a space that is set up and ready to shoot. Manage, review or cancel your session any time from your dashboard.",
    points: [
      "Equipment and amenities as listed",
      "Deposit released after the shoot",
    ],
  },
]

const hostSteps = [
  {
    title: "Create your listing",
    description:
      "Add your space in minutes — title, category, address, hourly rate, security deposit, capacity, photos, amenities and a short overview.",
  },
  {
    title: "Set your own terms",
    description:
      "You control the hourly rate and the refundable deposit. Creators see the full price before they book, so expectations stay clear.",
  },
  {
    title: "Go live and get discovered",
    description:
      "Your listing appears in Explore Studios and across category browsing, ready to accept instant booking requests from verified creators.",
  },
  {
    title: "Manage it all from your dashboard",
    description:
      "Edit details, update your listing, track bookings and keep your calendar full — everything lives in your StudioSpace dashboard.",
  },
]

const included = [
  {
    icon: DollarSignIcon,
    title: "Hourly pricing, upfront",
    description:
      "The rate you see is the rate you pay. Deposits and totals are shown before you confirm — no hidden booking fees, ever.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Protected payments",
    description:
      "Payments and refundable deposits are handled securely, so creators and hosts are both covered from checkout to wrap.",
  },
  {
    icon: ZapIcon,
    title: "Instant confirmation",
    description:
      "No quotes or back-and-forth. Book in a few clicks and your session is locked in immediately, with the details saved to your account.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 human support",
    description:
      "Real people on hand before, during and after the shoot — for creators booking a space and hosts renting one out.",
  },
]

const HowItWorkPage = () => {
  return (
    <main className="flex-1">
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <Image
          src="/images/vecteezy_camera-on-tripod-stage-lighting-smoky-background-event_69180758.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/30" />
        <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply" />
        <div className="absolute -top-32 -right-24 size-96 rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32">
          <p className="mb-4 text-xs font-bold tracking-[0.15em] text-red-500 uppercase sm:text-sm">
            How StudioSpace Works
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            From first search
            <br />
            to final take.
          </h1>
          <p className="mt-5 max-w-2xl text-sm/relaxed text-white/70 sm:text-base">
            StudioSpace connects creators with verified photo, film, podcast,
            music and workshop spaces — and helps hosts turn empty rooms into
            booked calendars. Here is the whole process, start to finish.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/studio-explore"
              className={buttonVariants({
                className:
                  "h-11 rounded-lg bg-red-600 px-6 text-base text-white hover:bg-red-600/90",
              })}
            >
              Explore Studios
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              href="/add-studio"
              className={buttonVariants({
                className:
                  "h-11 rounded-lg border border-white/20 bg-white/5 px-6 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white",
              })}
            >
              List Your Space
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
            {[
              "Verified listings",
              "Instant confirmation",
              "Secure payments",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-red-600 text-white">
                  <CheckIcon className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Audience shortcuts */}
        <div className="relative mx-auto grid max-w-7xl gap-4 px-6 pb-16 sm:grid-cols-2 sm:pb-20">
          {[
            {
              icon: CameraIcon,
              title: "I am a creator",
              description: "Find and book a studio space by the hour.",
              href: "#creators",
              cta: "See the creator flow",
            },
            {
              icon: PlusSquareIcon,
              title: "I am a host",
              description: "List your space and start taking bookings.",
              href: "#hosts",
              cta: "See the host flow",
            },
          ].map(({ icon: Icon, title, description, href, cta }) => (
            <a
              key={title}
              href={href}
              className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-red-600/50 hover:bg-white/10"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-red-600 text-white">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-bold">{title}</span>
                <span className="mt-1 block text-sm text-white/60">
                  {description}
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-400 group-hover:text-red-300">
                  {cta}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- For creators ---------- */}
      <section id="creators" className="scroll-mt-24 bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 dark:text-red-500 uppercase">
                For Creators
              </p>
              <h2 className="max-w-2xl text-3xl font-bold text-foreground sm:text-4xl">
                Your shoot, booked in four steps
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                No emails, no phone calls, no waiting on a quote. Find the right
                space, lock in your date and get on set.
              </p>
            </div>
            <Link
              href="/studio-explore"
              className={buttonVariants({
                variant: "outline",
                className:
                  "h-11 shrink-0 rounded-lg border-red-600/30 text-red-600 dark:text-red-500 hover:bg-red-600/10 hover:text-red-600",
              })}
            >
              Browse Studios
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {creatorSteps.map(
              ({ icon: Icon, title, description, points }, index) => (
                <div
                  key={title}
                  className="group relative rounded-2xl border border-border bg-section p-6 transition duration-300 hover:-translate-y-1 hover:border-red-600/30 hover:bg-card hover:shadow-lg"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-5 right-6 text-4xl font-bold text-foreground/10 transition-colors group-hover:text-red-600/20"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="mb-5 grid size-12 place-items-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/20">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ---------- For hosts ---------- */}
      <section id="hosts" className="scroll-mt-24 bg-section py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 dark:text-red-500 uppercase">
              For Hosts
            </p>
            <h2 className="max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
              Turn your space into a booked calendar
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Whether it is a photo loft, a sound stage or a spare podcast room,
              listing on StudioSpace is free and takes minutes.
            </p>

            <ol className="mt-10 space-y-8">
              {hostSteps.map(({ title, description }, index) => (
                <li key={title} className="relative flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-600 text-sm font-bold text-white ring-4 ring-section">
                    {index + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/add-studio"
              className={buttonVariants({
                className:
                  "mt-10 h-11 rounded-lg bg-red-600 px-6 text-base text-white hover:bg-red-600/90",
              })}
            >
              List Your Studio
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>

          {/* Illustrative listing card */}
          <div className="relative lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <div className="relative h-56">
                <Image
                  src="/images/vecteezy_neon-studio-setup-photography-and-videography-backdrop_69640568.jpg"
                  alt="Neon-lit studio with camera, lighting and a red backdrop"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-900 backdrop-blur">
                  Live listing
                </span>
                <span className="absolute right-4 bottom-4 rounded-lg bg-neutral-950/85 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                  $65 <span className="font-normal text-white/60">/ hour</span>
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Neon Loft Studio
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPinIcon className="size-4 text-red-600 dark:text-red-500" />
                      Brooklyn, NY
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm font-semibold text-foreground">
                    <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                    4.9
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-y border-border py-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">Max guests</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">$100</p>
                    <p className="text-xs text-muted-foreground">Deposit</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">4.9</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Professional lighting and cyc wall",
                    "Instant booking, no approval needed",
                    "You control rate, deposit and details",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckIcon className="size-4 shrink-0 text-red-600 dark:text-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 hidden items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
                <CheckIcon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  New booking confirmed
                </p>
                <p className="text-xs text-muted-foreground">
                  4 hours · $260 — payout after the shoot
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Included with every booking ---------- */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 dark:text-red-500 uppercase">
            No Surprises
          </p>
          <h2 className="mb-4 max-w-2xl text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need for a smooth booking
          </h2>
          <p className="mb-14 max-w-2xl text-sm text-muted-foreground sm:text-base">
            The same protections apply whether you are renting a space for the
            afternoon or filling your calendar for the season.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {included.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-section p-6 transition-colors hover:border-red-600/30 hover:bg-card hover:shadow-lg"
              >
                <div className="mb-5 grid size-11 place-items-center rounded-lg bg-red-600 text-white">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-section py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 dark:text-red-500 uppercase">
              Good To Know
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Questions, answered
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Everything creators and hosts ask before their first booking. If
              you still need a hand, our team is available around the clock.
            </p>

            <div className="mt-8 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-600 text-white">
                  <HeadphonesIcon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Still have questions?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We are here 24/7, before and after your booking.
                  </p>
                </div>
              </div>
              <Link
                href="#contact"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "mt-4 w-full border-red-600/30 text-red-600 dark:text-red-500 hover:bg-red-600/10 hover:text-red-600",
                })}
              >
                Contact Support
              </Link>
            </div>
          </div>

          <HowItWorksFaq />
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="relative overflow-hidden bg-neutral-950 py-20 text-white">
        <div className="absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.15em] text-red-500 uppercase">
            Ready When You Are
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Your next great shoot starts here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
            Find a space that fits your vision, or put the space you already own
            to work. Either way, it takes just a few minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/studio-explore"
              className={buttonVariants({
                className:
                  "h-11 rounded-lg bg-red-600 px-6 text-base text-white hover:bg-red-600/90",
              })}
            >
              Explore Studios
            </Link>
            <Link
              href="/add-studio"
              className={buttonVariants({
                className:
                  "h-11 rounded-lg border border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white",
              })}
            >
              List Your Space
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HowItWorkPage
