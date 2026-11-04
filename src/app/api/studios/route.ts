import { NextResponse, type NextRequest } from "next/server"

import { getJwtUser, unauthorized } from "@/lib/auth-jwt"
import { isCategorySlug } from "@/lib/constants"
import {
  createStudio,
  getFeaturedStudios,
  listStudios,
  studioInputSchema,
} from "@/lib/studios"

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // `featured=true` → top-rated / newest, hard-capped at 6 (plan section 4).
  if (searchParams.get("featured") === "true") {
    const studios = await getFeaturedStudios()
    return NextResponse.json({ studios })
  }

  const sort = searchParams.get("sort")
  const category = searchParams.get("category")

  const params = {
    search: searchParams.get("search") ?? undefined,
    category: category && isCategorySlug(category) ? category : undefined,
    minPrice: parseNumber(searchParams.get("minPrice")),
    maxPrice: parseNumber(searchParams.get("maxPrice")),
    // Private route support: /my-listings passes the logged-in user's email.
    ownerEmail: searchParams.get("ownerEmail") ?? undefined,
    sort:
      sort === ("price-asc" as const) ||
      sort === ("price-desc" as const) ||
      sort === ("rating" as const) ||
      sort === ("newest" as const)
        ? sort
        : undefined,
    page: Math.max(1, parseNumber(searchParams.get("page")) ?? 1),
    limit: Math.min(48, Math.max(1, parseNumber(searchParams.get("limit")) ?? 9)),
  }

  const result = await listStudios(params)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  // Mutations require a valid JWT (HTTPOnly cookie, or Bearer for API clients).
  const user = await getJwtUser(request)
  if (!user) return unauthorized("Please log in to add a studio.")

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = studioInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  // The owner comes from the verified JWT, never from the request body.
  const owner = {
    ownerEmail: user.email,
    ownerName: user.name,
    ownerPhoto: user.image ?? undefined,
  }

  const studio = await createStudio(parsed.data, owner)
  if (!studio) {
    return NextResponse.json(
      { message: "Database not configured — set MONGODB_URI to enable writes." },
      { status: 503 }
    )
  }
  return NextResponse.json({ studio }, { status: 201 })
}
