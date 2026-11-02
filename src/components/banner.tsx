"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { buttonVariants } from "@/components/ui/button"
import {
  CalendarDaysIcon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "lucide-react"

const slides = [
  {
    image:
      "/images/vecteezy_camera-on-tripod-stage-lighting-smoky-background-event_69180758.jpg",
    eyebrow: "Creative Studio Rental",
    headline: (
      <>
        Where Great Content
        <br />
        Comes Alive Inside
      </>
    ),
    subtext:
      "Create outstanding visual content in professional studio environments equipped with modern facilities, flexible rental options, and inspiring spaces for every production.",
  },
  {
    image:
      "/images/vecteezy_neon-studio-setup-photography-and-videography-backdrop_69640568.jpg",
    eyebrow: "Sound Stages & Video",
    headline: (
      <>
        Film In Spaces Built
        <br />
        For The Spotlight
      </>
    ),
    subtext:
      "From sound stages to neon-lit video suites, discover cinematic spaces with pro lighting, grip gear, and crews-ready setups for every shoot.",
  },
  {
    image:
      "/images/vecteezy_a-green-backdrop-with-a-camera-and-tripod-set-up-in-front-of-it_54450495.jpg",
    eyebrow: "Photo & Green Screen",
    headline: (
      <>
        Your Next Shoot Starts
        <br />
        On The Right Backdrop
      </>
    ),
    subtext:
      "Book green screens, cycloramas, and photo studios by the hour — with verified equipment, flexible time slots, and instant confirmation.",
  },
]

const features = [
  { icon: CameraIcon, label: "Professional Studio Rental" },
  { icon: ClockIcon, label: "Flexible Hourly Studio Rental" },
  { icon: CalendarDaysIcon, label: "Instant Online Studio Booking" },
]

function Banner() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className="relative overflow-hidden bg-[#150402]">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        effect="fade"
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        speed={700}
        className="h-[92vh] min-h-[640px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.eyebrow}>
            <div className="relative h-full w-full">
              {/* Slide photo + red-tinted overlays */}
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1c0603] via-[#4a1108]/85 to-black/30" />
              <div className="absolute inset-0 bg-[#a02310]/50 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />

              {/* Slide copy */}
              <div className="absolute inset-0">
                <div className="mx-auto flex h-full max-w-7xl flex-col items-start justify-end px-6 pb-24">
                  <p className="mb-4 text-xs font-bold tracking-[0.15em] text-white uppercase sm:text-sm">
                    {slide.eyebrow}
                  </p>
                  <h2 className="max-w-2xl text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
                    {slide.headline}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm/relaxed text-white/80 sm:text-base">
                    {slide.subtext}
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
                    </Link>
                    <Link
                      href="/studio-explore"
                      className={buttonVariants({
                        className:
                          "h-11 rounded-lg bg-white px-6 text-base text-neutral-900 hover:bg-white/85",
                      })}
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Feature checklist overlay (shared across slides) */}
      <ul className="pointer-events-none absolute top-24 left-6 z-10 hidden max-w-7xl flex-col gap-3 sm:top-28 md:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:flex">
        {features.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-red-600 text-white">
              <Icon className="size-3.5" />
            </span>
            <span className="text-sm font-medium text-white">{label}</span>
          </li>
        ))}
      </ul>

      {/* Prev / next controls */}
      <div className="absolute right-6 bottom-24 z-10 hidden gap-2 lg:flex">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.slidePrev()}
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-red-600 hover:bg-red-600"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiperRef.current?.slideNext()}
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-red-600 hover:bg-red-600"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>

      {/* "Most Popular Studio" card (shared overlay) */}
      <aside className="pointer-events-auto absolute right-6 bottom-8 z-10 hidden lg:block">
        <div className="w-72 rounded-xl bg-white p-4 shadow-2xl">
          <Image
            src="/images/vecteezy_neon-studio-setup-photography-and-videography-backdrop_69640568.jpg"
            alt="Studio setup with cameras, lighting and a red backdrop"
            width={544}
            height={320}
            sizes="272px"
            priority
            className="h-40 w-full rounded-lg object-cover"
          />
          <h3 className="mt-4 text-lg font-bold text-neutral-900">
            Most Popular Studio
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Professional studio designed to bring every vision to life.
          </p>
        </div>
      </aside>

      {/* Swiper bullets (styled via .hero-pagination in globals.css) */}
      <div className="hero-pagination absolute left-6 bottom-9 z-10 flex gap-2 md:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]" />
    </section>
  )
}

export { Banner }
