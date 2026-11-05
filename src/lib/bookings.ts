import { MongoClient, ObjectId, type Collection, type Document } from "mongodb"
import { z } from "zod"

/** Lifecycle values stored on a booking document. */
export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export function isBookingStatus(value: unknown): value is BookingStatus {
  return (
    typeof value === "string" &&
    BOOKING_STATUSES.includes(value as BookingStatus)
  )
}

/** Booking document as rendered by the My Bookings UI. */
export type Booking = {
  _id: string
  studioId?: string
  title: string
  image: string
  city: string
  hourlyRate: number | string
  securityDeposit?: number
  maxCapacity?: number
  departureDate: string
  bookingDate: string
  status?: BookingStatus
  email?: string
  username?: string
}

/** Payload accepted from the booking card. Extra studio fields are ignored. */
export const bookingInputSchema = z.object({
  studioId: z.string().min(1, "Studio id is required"),
  title: z.string().trim().min(1, "Studio title is required"),
  image: z.string().url("Studio image must be a valid URL"),
  city: z.string().trim().min(1, "Studio city is required"),
  hourlyRate: z.coerce.number().nonnegative("Hourly rate cannot be negative"),
  securityDeposit: z.coerce.number().nonnegative().optional(),
  maxCapacity: z.coerce.number().int().nonnegative().optional(),
  departureDate: z.string().min(1, "Departure date is required"),
})

export type BookingInput = z.infer<typeof bookingInputSchema>

type DbCollection = Collection<Document>

// One connection pool per server process — Atlas handshakes are slow and
// reconnecting on every request made the bookings page feel unreliable.
let clientPromise: Promise<MongoClient> | null = null

/**
 * Bookings are written to the `booking` collection used by the legacy Express
 * server, so existing reservations keep showing up after the move to /api.
 */
function getBookingsCollection(): Promise<DbCollection | null> {
  const uri = process.env.MONGODB_URI
  if (!uri || !uri.startsWith("mongodb")) return Promise.resolve(null)

  if (!clientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    clientPromise = client.connect().catch((error) => {
      // Allow the next request to retry a failed connection.
      clientPromise = null
      throw error
    })
  }

  return clientPromise
    .then((client) => client.db("studiospace").collection("booking"))
    .catch(() => null)
}

function toIsoString(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "string") return value
  return ""
}

function docToBooking(doc: Document): Booking {
  return {
    _id: String(doc._id ?? ""),
    studioId: doc.studioId ? String(doc.studioId) : undefined,
    title: String(doc.title ?? "Studio booking"),
    image: String(doc.image ?? ""),
    city: String(doc.city ?? ""),
    hourlyRate:
      typeof doc.hourlyRate === "number"
        ? doc.hourlyRate
        : String(doc.hourlyRate ?? 0),
    securityDeposit:
      doc.securityDeposit === undefined
        ? undefined
        : Number(doc.securityDeposit),
    maxCapacity:
      doc.maxCapacity === undefined ? undefined : Number(doc.maxCapacity),
    departureDate: toIsoString(doc.departureDate),
    bookingDate: toIsoString(doc.bookingDate),
    status: isBookingStatus(doc.status) ? doc.status : undefined,
    email: doc.email ? String(doc.email) : undefined,
    username: doc.username ? String(doc.username) : undefined,
  }
}

/** All bookings for one user; newest first. `null` means the DB is unavailable. */
export async function listBookingsByEmail(
  email: string
): Promise<Booking[] | null> {
  try {
    const collection = await getBookingsCollection()
    if (!collection) return null

    const docs = await collection
      .find({ email })
      .sort({ bookingDate: -1, _id: -1 })
      .toArray()

    return docs.map(docToBooking)
  } catch {
    return null
  }
}

/** Creates a Pending booking owned by the logged-in user. */
export async function createBooking(
  input: BookingInput,
  user: { email: string; name?: string | null }
): Promise<{ status: "created"; booking: Booking } | { status: "conflict" } | null> {
  try {
    const collection = await getBookingsCollection()
    if (!collection) return null

    // Double-booking guard: one confirmed reservation per studio per date.
    // Pending/Completed/Cancelled bookings do not block new ones.
    const existing = await collection.countDocuments(
      {
        studioId: input.studioId,
        departureDate: input.departureDate,
        status: "Confirmed",
      },
      { limit: 1 }
    )
    if (existing > 0) return { status: "conflict" }

    const doc: Document = {
      ...input,
      email: user.email,
      username: user.name ?? user.email,
      status: "Pending",
      bookingDate: new Date().toISOString(),
    }

    const result = await collection.insertOne(doc)
    return {
      status: "created",
      booking: docToBooking({ ...doc, _id: result.insertedId }),
    }
  } catch {
    return null
  }
}

/**
 * Updates a booking's status, scoped to the owner's email so one user cannot
 * cancel another user's reservation. Supports both Mongo ObjectIds and the
 * legacy slug-based ids found in older booking documents.
 */
export async function updateBookingStatus(
  id: string,
  email: string,
  status: BookingStatus
): Promise<{ matchedCount: number; modifiedCount: number } | null> {
  try {
    const collection = await getBookingsCollection()
    if (!collection) return null

    const idFilter: Document = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id }

    const result = await collection.updateOne(
      { ...idFilter, email },
      { $set: { status } }
    )

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    }
  } catch {
    return null
  }
}
