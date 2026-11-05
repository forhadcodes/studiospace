import { NextResponse } from "next/server"

import { getAuthUser, unauthorized, type JwtUser } from "@/lib/auth-jwt"
import {
  deleteStudio,
  studioUpdateSchema,
  getStudioById,
  updateStudio,
} from "@/lib/studios"

type RouteContext = { params: Promise<{ id: string }> }

/** Only the owner may edit or delete a listing. */
function isOwner(user: JwtUser, ownerEmail: string | undefined): boolean {
  return (
    typeof ownerEmail === "string" &&
    ownerEmail.toLowerCase() === user.email.toLowerCase()
  )
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const studio = await getStudioById(id)
  if (!studio) {
    return NextResponse.json({ message: "Studio not found" }, { status: 404 })
  }
  return NextResponse.json({ studio })
}

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized("Please log in to update this studio.")

  const { id } = await params

  const existing = await getStudioById(id)
  if (!existing) {
    return NextResponse.json({ message: "Studio not found" }, { status: 404 })
  }
  if (!isOwner(user, existing.ownerEmail)) {
    return NextResponse.json(
      { message: "You can only update your own studios." },
      { status: 403 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = studioUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const studio = await updateStudio(id, parsed.data)
  if (!studio) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to enable writes." },
      { status: 503 }
    )
  }
  return NextResponse.json({ studio })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized("Please log in to delete this studio.")

  const { id } = await params

  // TODO (plan section 5): cascade — delete the studio's pending bookings and
  // wishlist rows once those collections are wired up.
  const existing = await getStudioById(id)
  if (!existing) {
    return NextResponse.json({ message: "Studio not found" }, { status: 404 })
  }
  if (!isOwner(user, existing.ownerEmail)) {
    return NextResponse.json(
      { message: "You can only delete your own studios." },
      { status: 403 }
    )
  }

  const deleted = await deleteStudio(id)
  if (!deleted) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to enable writes." },
      { status: 503 }
    )
  }
  return NextResponse.json({ message: "Studio deleted" })
}
