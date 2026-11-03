import { NextResponse } from "next/server"

import { isBookingStatus, updateBookingStatus } from "@/lib/bookings"
import { auth } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

/** PATCH /api/bookings/:id — update a booking's status (currently Cancel). */
export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Please log in to update this booking." },
      { status: 401 }
    )
  }

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const status = (body as { status?: unknown } | null)?.status
  if (!isBookingStatus(status)) {
    return NextResponse.json(
      { message: `Invalid status: ${String(status)}` },
      { status: 400 }
    )
  }

  const result = await updateBookingStatus(id, session.user.email, status)
  if (result === null) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to update bookings." },
      { status: 503 }
    )
  }

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { message: "Booking not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(result)
}
