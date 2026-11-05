import { NextResponse } from "next/server"

import {
  getAuthUser,
  unauthorized,
} from "@/lib/auth-jwt"
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
  // Mutations require an authenticated user (JWT cookie/Bearer, or the
  // BetterAuth session cookie as the resilient same-origin fallback).
  const user = await getAuthUser(request)
  if (!user) return unauthorized("Please log in to book a studio.")

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

  const result = await createBooking(parsed.data, {
    email: user.email,
    name: user.name,
  })

  if (result === null) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to save bookings." },
      { status: 503 }
    )
  }

  if (result.status === "conflict") {
    // Challenge 2: no double-booking — one Confirmed reservation per studio
    // per departure date. The client shows this message in a toast.
    return NextResponse.json(
      {
        message:
          "This studio already has a confirmed booking for that date. Please pick a different date.",
      },
      { status: 409 }
    )
  }

  return NextResponse.json({ booking: result.booking }, { status: 201 })
}
