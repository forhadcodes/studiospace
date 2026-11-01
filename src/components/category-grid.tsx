import Link from "next/link"
import {
  CameraIcon,
  ClapperboardIcon,
  MicIcon,
  MusicIcon,
  PaintbrushIcon,
} from "lucide-react"

const categories = [
  {
    label: "Photo Studios",
    icon: CameraIcon,
    query: "photo",
    studios: "120+ spaces",
  },
  {
    label: "Sound Stages",
    icon: ClapperboardIcon,
    query: "sound-stage",
    studios: "80+ spaces",
  },
  {
    label: "Podcast Rooms",
    icon: MicIcon,
    query: "podcast",
    studios: "60+ spaces",
  },
  {
    label: "Music Suites",
    icon: MusicIcon,
    query: "music",
    studios: "45+ spaces",
  },
  {
    label: "Art Workshops",
    icon: PaintbrushIcon,
    query: "art-workshops",
    studios: "30+ spaces",
  },
]

function CategoryGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-2 text-xs font-bold tracking-[0.15em] text-red-600 uppercase">
          Find Your Perfect Space
        </p>
        <h2 className="mb-12 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Browse by Studio Categories
        </h2>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ label, icon: Icon, query, studios }) => (
            <Link
              key={label}
              // Category is pre-selected on the /studios page via the query param
              href={`/studios?category=${query}`}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl bg-neutral-950 p-5 text-white shadow-sm transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a1108]/80 via-neutral-950/40 to-neutral-950 opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute -right-6 -bottom-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                <Icon className="size-36 -rotate-12" strokeWidth={1} />
              </div>

              <Icon className="relative size-9 text-red-500" />
              <div className="relative">
                <h3 className="text-lg leading-tight font-bold">{label}</h3>
                <p className="mt-1 text-xs text-white/60">{studios}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export { CategoryGrid }
