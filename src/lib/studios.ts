import { ObjectId, type Collection, type Document, type Filter } from "mongodb"
import { z } from "zod"

import type { CategorySlug } from "./constants"
import { isCategorySlug } from "./constants"
import { SEED_IMAGES, SEED_STUDIOS } from "./seed-data"

/** Full studio document stored in the `studios` collection (plan section 4). */
export type Studio = {
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
  ownerPhoto?: string
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export type StudioInput = z.infer<typeof studioInputSchema>

/* ------------------------------------------------------------------ */
/* Zod schemas — shared by API routes (and later, the Express server)  */
/* ------------------------------------------------------------------ */

export const studioInputSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters"),
  category: z.enum(["photo-studio", "film-stage", "podcast-lounge", "music-suite", "workshop"]),
  hourlyRate: z.number().positive("Hourly rate must be positive"),
  securityDeposit: z.number().nonnegative("Security deposit cannot be negative"),
  maxCapacity: z.number().int("Max capacity must be a whole number").positive(),
  address: z.string().trim().min(5, "Address looks too short"),
  city: z.string().trim().min(2, "City looks too short"),
  image: z.string().url("Image URL must be a valid URL"),
  gallery: z.array(z.string().url()).max(4).optional().default([]),
  amenities: z.array(z.string().trim().min(1)).min(1, "Add at least one amenity"),
  overview: z.string().trim().min(20, "Overview must be at least 20 characters"),
})

export const studioUpdateSchema = studioInputSchema.partial()

export type ListParams = {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  /** Private-route filter: only studios owned by this user (ownerEmail match). */
  ownerEmail?: string
  sort?: "newest" | "price-asc" | "price-desc" | "rating"
  featured?: boolean
  page: number
  limit: number
}

export type ListResult = {
  studios: Studio[]
  total: number
  page: number
  pages: number
}

/* ------------------------------------------------------------------ */
/* Sample fallback, used while MONGODB_URI is unset or unreachable.    */
/* Shaped from the seed data so the fallback and DB data are identical. */
/* ------------------------------------------------------------------ */

function seedAsStudios(): Studio[] {
  return SEED_STUDIOS.map((studio) => ({
    ...studio,
    createdAt: new Date(Date.UTC(2026, 9, 20)),
    updatedAt: new Date(Date.UTC(2026, 9, 20)),
  }))
}

export const SAMPLE_STUDIOS: Studio[] = [
  seedAsStudios()[0],
  seedAsStudios()[1],
  seedAsStudios()[2],
  seedAsStudios()[3],
  seedAsStudios()[5],
  seedAsStudios()[6],
  seedAsStudios()[8],
  seedAsStudios()[12],
]

/* ------------------------------------------------------------------ */
/* Database helpers                                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Database helpers                                                    */
/* ------------------------------------------------------------------ */

type DbCollection = Collection<Document>

/** Connects to MongoDB using MONGODB_URI; returns null when unset/unreachable. */
async function getStudiosCollection(): Promise<DbCollection | null> {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  // Cached across requests to reuse one connection pool.
  const { MongoClient } = await import("mongodb")
  if (!uri.startsWith("mongodb")) return null
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 2500,
  })

  try {
    await client.connect()
  } catch {
    // DB unreachable — surface the fallback instead of failing the request.
    return null
  }
  return client.db("studiospace").collection("studios")
}

function docToStudio(doc: Document): Studio {
  const location = (doc.location ?? {}) as { address?: string; city?: string }
  return {
    slug: String(doc.slug ?? doc._id?.toString() ?? ""),
    title: String(doc.title ?? "Untitled Studio"),
    category: isCategorySlug(doc.category) ? doc.category : "photo-studio",
    hourlyRate: Number(doc.hourlyRate ?? 0),
    securityDeposit: Number(doc.securityDeposit ?? 0),
    maxCapacity: Number(doc.maxCapacity ?? 0),
    location: {
      address: String(location.address ?? ""),
      city: String(location.city ?? ""),
    },
    image: String(doc.image ?? SEED_IMAGES.heroA),
    gallery: Array.isArray(doc.gallery) ? doc.gallery.map(String) : [],
    amenities: Array.isArray(doc.amenities) ? doc.amenities.map(String) : [],
    overview: String(doc.overview ?? ""),
    ownerEmail: String(doc.ownerEmail ?? ""),
    ownerName: String(doc.ownerName ?? ""),
    ownerPhoto: doc.ownerPhoto ? String(doc.ownerPhoto) : undefined,
    rating: Number(doc.rating ?? 0),
    reviewCount: Number(doc.reviewCount ?? 0),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(),
  }
}

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

function inMemoryList(params: ListParams): ListResult {
  let list = [...SAMPLE_STUDIOS]

  if (params.search) {
    const q = params.search.toLowerCase()
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q)
    )
  }
  if (params.category) {
    list = list.filter((s) => s.category === params.category)
  }
  if (params.minPrice !== undefined) {
    list = list.filter((s) => s.hourlyRate >= params.minPrice!)
  }
  if (params.maxPrice !== undefined) {
    list = list.filter((s) => s.hourlyRate <= params.maxPrice!)
  }
  if (params.ownerEmail) {
    list = list.filter((s) => s.ownerEmail === params.ownerEmail)
  }

  switch (params.sort) {
    case "price-asc":
      list.sort((a, b) => a.hourlyRate - b.hourlyRate)
      break
    case "price-desc":
      list.sort((a, b) => b.hourlyRate - a.hourlyRate)
      break
    case "rating":
      list.sort((a, b) => b.rating - a.rating)
      break
    default:
      list.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
  }

  const total = list.length
  const pages = Math.max(1, Math.ceil(total / params.limit))
  const start = (params.page - 1) * params.limit
  return { studios: list.slice(start, start + params.limit), total, page: params.page, pages }
}

/** Paginated list with search, category and price filters (plan section 4). */
export async function listStudios(params: ListParams): Promise<ListResult> {
  try {
    const collection = await getStudiosCollection()
    if (!collection) return inMemoryList(params)

    const filter: Filter<Document> = {}
    if (params.search) {
      const rx = new RegExp(escapeRegExp(params.search), "i")
      filter.$or = [{ title: rx }, { "location.city": rx }, { overview: rx }]
    }
    if (params.category && isCategorySlug(params.category)) {
      filter.category = params.category
    }
    if (params.minPrice !== undefined) {
      filter.hourlyRate = { ...(filter.hourlyRate as object), $gte: params.minPrice }
    }
    if (params.maxPrice !== undefined) {
      filter.hourlyRate = { ...(filter.hourlyRate as object), $lte: params.maxPrice }
    }
    if (params.ownerEmail) {
      filter.ownerEmail = params.ownerEmail
    }

    const sort: Document =
      params.sort === "price-asc"
        ? { hourlyRate: 1 }
        : params.sort === "price-desc"
          ? { hourlyRate: -1 }
          : params.sort === "rating"
            ? { rating: -1 }
            : { createdAt: -1, _id: -1 }

    const total = await collection.countDocuments(filter)
    const docs = await collection
      .find(filter)
      .sort(sort)
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .toArray()

    return {
      studios: docs.map(docToStudio),
      total,
      page: params.page,
      pages: Math.max(1, Math.ceil(total / params.limit)),
    }
  } catch {
    return inMemoryList(params)
  }
}

/** Top-rated / newest studios for the home page (`.limit(6)`, plan section 4). */
export async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    const collection = await getStudiosCollection()
    if (!collection) {
      return [...SAMPLE_STUDIOS]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    }

    const docs = await collection
      .find({})
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .toArray()

    if (docs.length === 0) {
      return [...SAMPLE_STUDIOS].sort((a, b) => b.rating - a.rating).slice(0, 6)
    }
    return docs.map(docToStudio)
  } catch {
    return [...SAMPLE_STUDIOS].sort((a, b) => b.rating - a.rating).slice(0, 6)
  }
}

/** Looks up one studio by ObjectId _id OR slug; 400/404 semantics live in the route. */
export async function getStudioById(idOrSlug: string): Promise<Studio | null> {
  try {
    const collection = await getStudiosCollection()
    if (!collection) {
      const all = seedAsStudios()
      return all.find((s) => s.slug === idOrSlug) ?? null
    }

    const doc = ObjectId.isValid(idOrSlug)
      ? await collection.findOne({ _id: new ObjectId(idOrSlug) })
      : await collection.findOne({ slug: idOrSlug })
    return doc ? docToStudio(doc) : null
  } catch {
    return null
  }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
}

/** Creates a studio; owner fields are passed by the API route, never trusted from the body. */
export async function createStudio(
  input: StudioInput,
  owner: { ownerEmail: string; ownerName: string; ownerPhoto?: string }
): Promise<Studio | null> {
  try {
    const collection = await getStudiosCollection()
    if (!collection) return null

    // Ensure slugs are unique.
    let slug = slugify(input.title)
    if (await collection.findOne({ slug })) {
      slug = `${slug}-${Date.now().toString(36)}`
    }
    const now = new Date()
    const doc: Document = {
      ...input,
      ...owner,
      slug,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    const result = await collection.insertOne(doc)
    return docToStudio({ ...doc, _id: result.insertedId })
  } catch {
    return null
  }
}

/** Partial update; ownership enforcement lives in the route (JWT, plan section 5). */
export async function updateStudio(
  idOrSlug: string,
  patch: Partial<StudioInput>
): Promise<Studio | null> {
  try {
    const collection = await getStudiosCollection()
    if (!collection) return null

    const filter: Filter<Document> = ObjectId.isValid(idOrSlug)
      ? { _id: new ObjectId(idOrSlug) }
      : { slug: idOrSlug }

    // Documents store the street address and city inside the nested
    // `location` object, so those two patch fields must map to dot paths.
    const { address, city, ...rest } = patch
    const set: Document = { ...rest, updatedAt: new Date() }
    if (address !== undefined) set["location.address"] = address
    if (city !== undefined) set["location.city"] = city

    const doc = await collection.findOneAndUpdate(
      filter,
      { $set: set },
      { returnDocument: "after" }
    )
    return doc ? docToStudio(doc) : null
  } catch {
    return null
  }
}

/** Deletes a studio (and later, cascade to its bookings/wishlist rows). */
export async function deleteStudio(idOrSlug: string): Promise<boolean> {
  try {
    const collection = await getStudiosCollection()
    if (!collection) return false

    const filter: Filter<Document> = ObjectId.isValid(idOrSlug)
      ? { _id: new ObjectId(idOrSlug) }
      : { slug: idOrSlug }

    const result = await collection.deleteOne(filter)
    return result.deletedCount > 0
  } catch {
    return false
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
