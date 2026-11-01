import type { CategorySlug } from "./constants"

export type SeedStudio = {
  slug: string
  title: string
  category: CategorySlug
  hourlyRate: number
  securityDeposit: number
  maxCapacity: number
  location: { address: string; city: string }
  image: string
  gallery: string[]
  amenities: string[]
  overview: string
  ownerEmail: string
  ownerName: string
  rating: number
  reviewCount: number
}

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`

const NAMES = [
  "1516035069371-29a1b244cc32",
  "1598550476439-6847785fcea6",
  "1493225457124-a3eb161ffa5f",
  "1513364776144-60967b0f800f",
  "1470225620780-dba8ba36b745",
  "1485579149621-3123dd979885",
  "1500634245200-e5245c7574ef",
  "1520523839897-bd0b52f945a0",
  "1554048612-b6a482bc67e5",
  "1590602847861-f357a9332bbc",
  "1598488035139-bdbb2231ce04",
  "1497366216548-37526070297c",
  "1524230572899-a752b3835840",
  "1520166012956-add9ba93ca5d",
]

/** Verified working Unsplash photos (checked HTTP 200 on 2026-10-30). */
export const SEED_IMAGES = {
  heroA: IMG(NAMES[0]),
  heroB: IMG(NAMES[1]),
  heroC: IMG(NAMES[2]),
}

/** 14 realistic studios spread across all five canonical categories. */
export const SEED_STUDIOS: SeedStudio[] = [
  {
    slug: "golden-hour-photo-loft",
    title: "Golden Hour Photo Loft",
    category: "photo-studio",
    hourlyRate: 45,
    securityDeposit: 100,
    maxCapacity: 12,
    location: { address: "214 Rapid Street", city: "Beverly Hills, CA" },
    image: IMG(NAMES[0]),
    gallery: [IMG(NAMES[0]), IMG(NAMES[5]), IMG(NAMES[3])],
    amenities: ["Softbox lighting", "Cyc wall", "Dressing room", "Makeup station", "Free parking"],
    overview:
      "A daylight-filled loft studio with a 6-meter cyc wall, professional strobes and a clients' lounge. Ideal for lookbooks, product shoots and editorial portraits.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.9,
    reviewCount: 12,
  },
  {
    slug: "neon-nights-soundstage",
    title: "Neon Nights Soundstage",
    category: "film-stage",
    hourlyRate: 85,
    securityDeposit: 250,
    maxCapacity: 40,
    location: { address: "88 Grand Avenue", city: "Brooklyn, NY" },
    image: IMG(NAMES[1]),
    gallery: [IMG(NAMES[1]), IMG(NAMES[9]), IMG(NAMES[7])],
    amenities: ["Blackout", "Grid lighting", "Green screen", "Generator", "Loading dock"],
    overview:
      "250 m² soundstage with full blackout, a 12-meter lighting grid and a color-changing LED backdrop built for music videos and commercials.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.8,
    reviewCount: 9,
  },
  {
    slug: "velvet-podcast-lounge",
    title: "Velvet Podcast Lounge",
    category: "podcast-lounge",
    hourlyRate: 25,
    securityDeposit: 50,
    maxCapacity: 6,
    location: { address: "5 Mercer Walk", city: "Chicago, IL" },
    image: IMG(NAMES[2]),
    gallery: [IMG(NAMES[2]), IMG(NAMES[10]), IMG(NAMES[13])],
    amenities: ["4 mics", "Recorders", "Acoustic panels", "Monitor feeds", "Refreshments"],
    overview:
      "A warm, fully treated 4-seat podcast lounge with Shure SM7Bs, Rodecaster Pro and dual 4K camera feeds right out of the box.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.9,
    reviewCount: 18,
  },
  {
    slug: "ivory-music-suite",
    title: "Ivory Music Suite",
    category: "music-suite",
    hourlyRate: 40,
    securityDeposit: 80,
    maxCapacity: 8,
    location: { address: "19 Jubilee Road", city: "Nashville, TN" },
    image: IMG(NAMES[3]),
    gallery: [IMG(NAMES[3]), IMG(NAMES[8]), IMG(NAMES[11])],
    amenities: ["Grand piano", "Isolation booth", "Midi rig", "Studio monitors", "Backline"],
    overview:
      "Acoustically tuned writing and tracking suite with a Yamaha grand, an iso booth and outboard preamps used by three of the city's top records.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.8,
    reviewCount: 11,
  },
  {
    slug: "the-clay-workshop",
    title: "The Clay Workshop",
    category: "workshop",
    hourlyRate: 30,
    securityDeposit: 60,
    maxCapacity: 15,
    location: { address: "7 Kiln Lane", city: "Portland, OR" },
    image: IMG(NAMES[4]),
    gallery: [IMG(NAMES[4]), IMG(NAMES[13]), IMG(NAMES[12])],
    amenities: ["6 wheels", "Kiln", "Aprons", "Tool wall", "Ventilation"],
    overview:
      "A bright ceramics workshop with six wheels, two kilns and a hand-building table — bookable for classes, team events and private time.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.7,
    reviewCount: 15,
  },
  {
    slug: "daylight-cyc-studio",
    title: "Daylight Cyc Studio",
    category: "photo-studio",
    hourlyRate: 55,
    securityDeposit: 120,
    maxCapacity: 20,
    location: { address: "1101 Sunset Blvd", city: "Los Angeles, CA" },
    image: IMG(NAMES[5]),
    gallery: [IMG(NAMES[5]), IMG(NAMES[0]), IMG(NAMES[6])],
    amenities: ["North light", "Infinity cove", "Profiler", "Steamer", "Changing area"],
    overview:
      "Huge north-facing windows over a 40-foot infinity cove — the go-to daylight space for fashion and swimwear campaigns.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.8,
    reviewCount: 7,
  },
  {
    slug: "blackbox-film-stage",
    title: "Blackbox Film Stage",
    category: "film-stage",
    hourlyRate: 95,
    securityDeposit: 300,
    maxCapacity: 50,
    location: { address: "42 Stage Lane", city: "Atlanta, GA" },
    image: IMG(NAMES[6]),
    gallery: [IMG(NAMES[6]), IMG(NAMES[1]), IMG(NAMES[9])],
    amenities: ["Lighting grid", "Dress rooms", "Production office", "Forklift", "Drive-in access"],
    overview:
      "Drive-in blackbox stage with a two-catwalk grid, three dress rooms and an attached production office for multi-day shoots.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.6,
    reviewCount: 5,
  },
  {
    slug: "green-screen-garage",
    title: "Green Screen Garage",
    category: "film-stage",
    hourlyRate: 65,
    securityDeposit: 150,
    maxCapacity: 25,
    location: { address: "318 Fabricator Way", city: "Austin, TX" },
    image: IMG(NAMES[7]),
    gallery: [IMG(NAMES[7]), IMG(NAMES[2]), IMG(NAMES[5])],
    amenities: ["3-wall green screen", "Track for camera", "Sound treatment", "Workstations"],
    overview:
      "A 3-wall green screen with VFX-friendly track space and color-accurate lighting — bring your Virtual Production rig or borrow ours.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.7,
    reviewCount: 8,
  },
  {
    slug: "echo-chamber-podcasts",
    title: "Echo Chamber Podcasts",
    category: "podcast-lounge",
    hourlyRate: 35,
    securityDeposit: 70,
    maxCapacity: 4,
    location: { address: "77 Beacon Street", city: "Boston, MA" },
    image: IMG(NAMES[8]),
    gallery: [IMG(NAMES[8]), IMG(NAMES[2]), IMG(NAMES[10])],
    amenities: ["Video podcast", "Prompter", "3-camera", "Live streaming", "Fiber"],
    overview:
      "Video-first podcast suite with three cameras, streaming-ready fiber and a soundproofed double-door entry. Release-ready audio in one session.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.9,
    reviewCount: 14,
  },
  {
    slug: "sitar-room-music",
    title: "Sitar & Strings Room",
    category: "music-suite",
    hourlyRate: 28,
    securityDeposit: 55,
    maxCapacity: 6,
    location: { address: "12 Ryan's Court", city: "Seattle, WA" },
    image: IMG(NAMES[9]),
    gallery: [IMG(NAMES[9]), IMG(NAMES[3]), IMG(NAMES[8])],
    amenities: ["String collection", "World percussion", "Ambisonic mics", "Tea corner"],
    overview:
      "A cozy rehearsal and recording room with a curated string and world-percussion collection, tuned by hand before every session.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.7,
    reviewCount: 6,
  },
  {
    slug: "printmakers-studio",
    title: "Printmakers Studio",
    category: "workshop",
    hourlyRate: 22,
    securityDeposit: 45,
    maxCapacity: 10,
    location: { address: "500 Ink Row", city: "Philadelphia, PA" },
    image: IMG(NAMES[10]),
    gallery: [IMG(NAMES[10]), IMG(NAMES[4]), IMG(NAMES[12])],
    amenities: ["Etching press", "Screen printing", "Ink library", "Drying racks"],
    overview:
      "A community print shop with an etching press and screen-printing bays, open to artists who take the one-hour induction.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.6,
    reviewCount: 4,
  },
  {
    slug: "the-art-attic",
    title: "The Art Attic",
    category: "workshop",
    hourlyRate: 26,
    securityDeposit: 40,
    maxCapacity: 12,
    location: { address: "19 Rooftop Lane", city: "Denver, CO" },
    image: IMG(NAMES[11]),
    gallery: [IMG(NAMES[11]), IMG(NAMES[4]), IMG(NAMES[10])],
    amenities: ["Easels x12", "Skylight", "Ventilation", "Sink", "Projector"],
    overview:
      "A skylit attic studio for painting and drawing workshops, complete with twelve easels and panoramic mountain light.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.8,
    reviewCount: 9,
  },
  {
    slug: "lens-and-light-lab",
    title: "Lens & Light Lab",
    category: "photo-studio",
    hourlyRate: 38,
    securityDeposit: 90,
    maxCapacity: 10,
    location: { address: "73 Aperture Street", city: "Miami, FL" },
    image: IMG(NAMES[12]),
    gallery: [IMG(NAMES[12]), IMG(NAMES[0]), IMG(NAMES[5])],
    amenities: ["Profoto kit", "Tether station", "Product table", "Color filter library"],
    overview:
      "Precision tabletop and product studio with a Profoto kit, tethered capture station and a full filter library.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.9,
    reviewCount: 16,
  },
  {
    slug: "skyline-mix-room",
    title: "Skyline Mix Room",
    category: "music-suite",
    hourlyRate: 50,
    securityDeposit: 100,
    maxCapacity: 5,
    location: { address: "3040 Loft 55", city: "San Diego, CA" },
    image: IMG(NAMES[13]),
    gallery: [IMG(NAMES[13]), IMG(NAMES[3]), IMG(NAMES[9])],
    amenities: ["ATC monitors", "Outboard rack", "Dolby Atmos 7.1.4", "Rooftop deck"],
    overview:
      "An Atmos-ready mix room with ATC mains and a rooftop deck — mix with the sun setting over the bay.",
    ownerEmail: process.env.DEMO_HOST_EMAIL ?? "examiner@studiospace.dev",
    ownerName: "Forhad Hussain",
    rating: 4.7,
    reviewCount: 10,
  },
]
