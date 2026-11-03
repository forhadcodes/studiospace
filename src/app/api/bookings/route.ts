import { NextResponse } from "next/server"

import {
  bookingInputSchema,
  createBooking,
  listBookingsByEmail,
} from "@/lib/bookings"
import { auth } from "@/lib/auth"

/** GET /api/bookings — all bookings belonging to the logged-in user. */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Please log in to view bookings." }, { status: 401 })
  }

  const bookings = await listBookingsByEmail(session.user.email)
  if (bookings === null) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to load bookings." },
      { status: 503 }
    )
  }

  return NextResponse.json({ bookings })
}

/** POST /api/bookings — create a Pending booking for the logged-in user. */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Please log in to book a studio." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = bookingInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const booking = await createBooking(parsed.data, {
    email: session.user.email,
    name: session.user.name,
  })

  if (!booking) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to save bookings." },
      { status: 503 }
    )
  }

  return NextResponse.json({ booking }, { status: 201 })
}
