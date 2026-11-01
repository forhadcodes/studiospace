import { NextResponse } from "next/server"

import {
  deleteStudio,
  studioUpdateSchema,
  getStudioById,
  updateStudio,
} from "@/lib/studios"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const studio = await getStudioById(id)
  if (!studio) {
    return NextResponse.json({ message: "Studio not found" }, { status: 404 })
  }
  return NextResponse.json({ studio })
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params

  // TODO (Day 2 / plan section 5): JWT ownership check — load the studio,
  // compare ownerEmail with the token email, and return 403 on mismatch.
  const existing = await getStudioById(id)
  if (!existing) {
    return NextResponse.json({ message: "Studio not found" }, { status: 404 })
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

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params

  // TODO (Day 2 / plan section 5): JWT ownership check → 403 for non-owners,
  // and cascade: delete the studio's pending bookings and wishlist rows.
  const existing = await getStudioById(id)
  if (!existing) {
    return NextResponse.json({ message: "Studio not found" }, { status: 404 })
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
