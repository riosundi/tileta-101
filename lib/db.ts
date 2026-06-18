import { neon } from "@neondatabase/serverless"

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  ""

if (!connectionString) {
  console.log("[v0] Missing DATABASE_URL environment variable")
}

export const sql = neon(connectionString)
