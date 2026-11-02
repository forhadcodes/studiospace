import Link from "next/link";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarCheckIcon,
  CalendarPlusIcon,
  ClockIcon,
  CoinsIcon,
  EditIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/constants";

/* ---------- Content ---------- */

const bookingSteps = [
  {
    icon: SearchIcon,
    title: "Discover a studio",
    description:
      "Browse the Explore page by category, city, capacity and hourly rate. Every listing shows its gear, deposit and specs up front.",
  },
  {
    icon: CalendarPlusIcon,
    title: "Pick your date",
    description:
      "On the studio page choose your departure date in the booking card, check the hourly rate and refundable security deposit, then hit Book Now.",
  },
  {
    icon: ClockIcon,
    title: "Reservation starts as Pending",
    description:
      "Your reservation is saved instantly in the bookings collection with a Pending status — the host can still confirm it.",
  },
  {
    icon: ZapIcon,
    title: "Confirmed & ready to shoot",
    description:
      "Once confirmed, the badge turns green. Show up with your team — the space is yours for the hours you booked.",
  },
];

const statuses = [
  {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    description:
      "Reservation received and waiting on confirmation. You can cancel this booking yourself at any point it is pending.",
  },
  {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700",
    description:
      "The studio slot is locked in for your date. No further action needed — see you on set.",
  },
  {
    label: "Completed",
    className: "bg-sky-50 text-sky-700",
    description:
      "The departure date has passed and the session was used. You'll find it in your history with all details intact.",
  },
  {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
    description:
      "Cancelled bookings stay in your history so your records are never lost — they simply can't be used again.",
  },
];

const hostSteps = [
  {
    icon: CalendarCheckIcon,
    title: "List your space",
    description:
      "Add hourly rate, refundable security deposit, cover image, gallery, amenities and an overview. Your account email is attached automatically as the owner.",
    href: "/add-studio",
    cta: "Add a Studio",
  },
  {
    icon: EditIcon,
    title: "Update anytime",
    description:
      "Open My Studio Listings and edit pricing, photos or descriptions in one dialog — changes save straight to the database.",
    href: "/my-listings",
    cta: "My Listings",
  },
  {
    icon: Trash2Icon,
    title: "Delete with confirmation",
    description:
      "Removed a space or stopped renting? Deleting asks for confirmation first, then permanently removes the listing after a success toast.",
    href: "/my-listings",
    cta: "My Listings",
  },
];

const faqs = [
  {
    question: "Where do I find my reservations?",
    answer:
      "Every booking you make is collected on the My Bookings page with a status badge, departure date, booking ID and price. It's a private page — you need to be logged in.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes — while a booking is still Pending you get a Cancel Booking button on its card. Cancelling marks it as Cancelled; it stays in your history for reference.",
  },
  {
    question: "Is the security deposit charged up front?",
    answer:
      "The deposit is refundable. It is shown separately on every studio card so you always know the full picture: hourly rate plus deposit.",
  },
  {
    question: "Can I list my own studio?",
    answer:
      "Absolutely. Hosts add a space on the Add Studio page, and everything listed under their account email appears — and can be managed — on the My Studio Listings page.",
  },
];

/* ---------- Page ---------- */

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
            Simple By Design
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            How StudioSpace Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600">
            Book creative spaces by the hour or list your own studio. From
            first search to final wrap, every step lives in one place — and
            your bookings, statuses and listings stay in your account.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio-explore"
              className={buttonVariants({
                className: "bg-red-600 text-white hover:bg-red-600/90",
              })}
            >
              Explore Studios
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              href="/add-studio"
              className={buttonVariants({ variant: "outline" })}
            >
              List Your Studio
            </Link>
          </div>
        </div>
      </section>

      {/* For creators: booking steps */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Booking a studio, step by step
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Four steps between you and a fully equipped space
        </p>

        <ol className="mt-8 grid gap-5 sm:grid-cols-2">
          {bookingSteps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <Icon className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Status lifecycle */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            What each booking status means
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Live badges on the My Bookings page — so you always know where a
            reservation stands
          </p>

          <div className="mt-8 space-y-4">
            {statuses.map((status) => (
              <div
                key={status.label}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <span
                  className={`mt-0.5 flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                >
                  <BadgeCheckIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
                <p className="text-sm leading-relaxed text-gray-600">
                  {status.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For hosts */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Renting out your studio?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Everything a host needs, in your account
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {hostSteps.map(({ icon: Icon, title, description, href, cta }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="grid size-11 place-items-center rounded-lg bg-red-600 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
              <Link
                href={href}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:text-red-700"
              >
                {cta}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing & protection */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <CoinsIcon className="h-6 w-6 text-red-600" />
              <h3 className="mt-3 font-semibold text-gray-900">
                Transparent hourly pricing
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Every studio shows its exact rate per hour — no quotes, no
                negotiation, no hidden markup between booking and shoot.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <ShieldCheckIcon className="h-6 w-6 text-red-600" />
              <h3 className="mt-3 font-semibold text-gray-900">
                Refundable security deposit
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Deposits protect every host&apos;s gear and space, and are refunded
                when the studio returns as it left — deposit protection is
                built in.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <UsersIcon className="h-6 w-6 text-red-600" />
              <h3 className="mt-3 font-semibold text-gray-900">
                Built for every creator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                From a two-person podcast to a full production with 25 guests,
                capacity filters make sure the space fits your whole team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Five kinds of creative spaces
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Every listing on StudioSpace falls into one of these categories
        </p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_SLUGS.map((slug) => (
            <li
              key={slug}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm"
            >
              <h3 className="font-semibold text-gray-900">
                {CATEGORY_LABELS[slug]}
              </h3>
              <Link
                href="/studio-explore"
                className="mt-2 inline-block text-xs font-medium text-red-600 transition hover:text-red-700"
              >
                Browse →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="cursor-pointer list-none font-medium text-gray-900 marker:hidden">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-950 px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Ready for your next session?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Browse verified studios, book your hours in minutes, or list your
            own space and start hosting.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio-explore"
              className={buttonVariants({
                className: "bg-red-600 text-white hover:bg-red-600/90",
              })}
            >
              Explore Studios
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              href="/my-booking"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
