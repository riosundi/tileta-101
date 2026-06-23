import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  )
}

let _sql: NeonQueryFunction<false, false> | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql
  const connectionString = getConnectionString()
  if (!connectionString) {
    throw new Error(
      "Missing database connection string. Set the DATABASE_URL environment variable (Neon integration).",
    )
  }
  _sql = neon(connectionString)
  return _sql
}

// Lazy proxy: the Neon client is only created on first query, not at import time.
// This prevents module-evaluation crashes when env vars load slightly later.
export const sql = new Proxy((() => {}) as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args: Parameters<NeonQueryFunction<false, false>>) {
    // @ts-expect-error - forwarding tagged-template / call args to the real client
    return getSql()(...args)
  },
  get(_target, prop, receiver) {
    const client = getSql()
    const value = Reflect.get(client as object, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
}) as NeonQueryFunction<false, false>
