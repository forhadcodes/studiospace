import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CameraIcon,
  CheckIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | StudioSpace",
  description:
    "StudioSpace connects creators with verified photo, film, podcast, music and workshop spaces — and helps hosts turn their spaces into booked calendars.",
}

const stats = [
  { value: "120+", label: "Studios listed" },
  { value: "5", label: "Space categories" },
  { value: "24/7", label: "Creator & host support" },
]

const values = [
  {
    icon: BadgeCheckIcon,
    title: "Verified quality",
    description:
      "Every host is identity-verified and every listing is checked for real photos, honest details and the amenities it promises.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Honest pricing",
    description:
      "Hourly rates and refundable deposits are shown upfront. No quotes, no hidden fees, no surprises at checkout.",
  },
  {
    icon: HeadphonesIcon,
    title: "Real support",
    description:
      "A real team is available around the clock for creators and hosts — before, during and after every booking.",
  },
  {
    icon: CameraIcon,
    title: "Built for creators",
    description:
      "From a two-hour podcast session to a full-day film shoot, the platform is shaped around how productions actually work.",
  },
]

const AboutUsPage = () => {
  return (
    <main className="flex-1">
      {/* ---------- Intro ---------- */}
      <section className="bg-neutral-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
              Our Story
            </p>
            <h1 className="text-4xl leading-tight font-bold text-neutral-900 sm:text-5xl">
              Built for the people
              <br />
              who make.
            </h1>
            <p className="mt-5 max-w-xl text-sm/relaxed text-neutral-600 sm:text-base">
              StudioSpace started with a simple frustration: finding a
              professional studio meant endless calls, messages and guesswork.
              We built one place where creators can book verified spaces by the
              hour — and where hosts can put the spaces they already own to
              work.
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
                  variant: "outline",
                  className:
                    "h-11 rounded-lg border-red-200 bg-white px-6 text-base text-red-600 hover:bg-red-50 hover:text-red-600",
                })}
              >
                List Your Space
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200 shadow-xl">
              <Image
                src="/images/vecteezy_a-green-backdrop-with-a-camera-and-tripod-set-up-in-front-of-it_54450495.jpg"
                alt="Camera on a tripod in front of a studio green screen"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg sm:left-8">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-600 text-white">
                <BadgeCheckIcon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  Verified spaces only
                </p>
                <p className="text-xs text-neutral-500">
                  Real photos, honest details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="mx-auto mt-20 max-w-7xl border-t border-neutral-200 px-6 pt-10">
          <dl className="grid gap-8 sm:grid-cols-3">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="text-sm text-neutral-500">{label}</dt>
                <dd className="mt-1 text-3xl font-bold text-neutral-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Mission ---------- */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
            Why We Exist
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Great spaces should be easy to find.
          </h2>
          <p className="mt-4 text-sm/relaxed text-neutral-600 sm:text-base">
            Too many great ideas stall because the right space is hard to find
            or harder to book. We want booking a studio to feel as simple as
            booking a table — clear price, confirmed date, no back-and-forth.
            For hosts, that same simplicity means less admin and more time
            doing what they love.
          </p>

          <ul className="mt-8 grid w-full gap-3 text-left sm:grid-cols-2">
            {[
              "Verified studios, real photos and honest details",
              "Hourly rates and deposits shown before you book",
              "Instant confirmation and secure payments",
              "Support for creators and hosts, 24/7",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-red-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="bg-neutral-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
            What We Stand For
          </p>
          <h2 className="mb-12 max-w-2xl text-3xl font-bold text-neutral-900 sm:text-4xl">
            The principles behind every booking
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-red-200"
              >
                <div className="mb-5 grid size-11 place-items-center rounded-lg bg-red-600 text-white">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden bg-neutral-950 py-20 text-white">
        <div className="absolute -top-32 right-0 size-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.15em] text-red-500 uppercase">
            Join The Community
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Find your space, or share it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
            Whether you are shooting your next project or opening your doors to
            creators, StudioSpace makes it simple.
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
              href="/how-it-work"
              className={buttonVariants({
                className:
                  "h-11 rounded-lg border border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white",
              })}
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutUsPage
