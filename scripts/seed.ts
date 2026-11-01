/**
 * Seed script — plan section 9, prompt 9.
 * Inserts 14 realistic studios across all five categories, plus the indexes
 * the queries rely on. Run with: npm run seed
 */
import { MongoClient } from "mongodb"

import { SEED_STUDIOS } from "../src/lib/seed-data"

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
     
    console.error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and fill it in."
    )
    process.exit(1)
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 })
  try {
    await client.connect()
  } catch (error) {
     
    console.error("Could not connect to MongoDB:", error)
    process.exit(1)
  }

  const db = client.db("studiospace")
  const now = new Date()

  // Wipe and re-seed for a deterministic dataset.
  await db.collection("studios").deleteMany({})

  const docs = SEED_STUDIOS.map((studio, index) => ({
    ...studio,
    createdAt: new Date(now.getTime() - (SEED_STUDIOS.length - index) * 86_400_000),
    updatedAt: now,
  }))

  const result = await db.collection("studios").insertMany(docs)
   
  console.log(`Inserted ${result.insertedCount} studios.`)

  // Indexes (plan section 4).
  await db.collection("studios").createIndex({ category: 1 })
  await db.collection("studios").createIndex({ ownerEmail: 1 })
  await db.collection("studios").createIndex({
    title: "text",
    "location.city": "text",
    overview: "text",
  })
  await db
    .collection("bookings")
    .createIndex({ studioId: 1, status: 1, startAt: 1, endAt: 1 })
  await db.collection("bookings").createIndex({ userEmail: 1 })
  await db.collection("bookings").createIndex({ hostEmail: 1 })
  await db.collection("reviews").createIndex({ studioId: 1, userEmail: 1 }, { unique: true })
  await db.collection("wishlist").createIndex(
    { userEmail: 1, studioId: 1 },
    { unique: true }
  )
   
  console.log("Created indexes on studios, bookings, reviews and wishlist.")


  await client.close()
}

seed()
