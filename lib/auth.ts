import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import type { AppUser } from "@/lib/types"

const COOKIE = "tileta_uid"

export async function getCurrentUser(): Promise<AppUser | null> {
  const store = await cookies()
  const uid = store.get(COOKIE)?.value
  if (!uid) return null
  const rows = (await sql`
    SELECT id, full_name, role, wallet_balance::float AS wallet_balance, avatar_url, status, created_at
    FROM app_users WHERE id = ${uid} LIMIT 1
  `) as AppUser[]
  return rows[0] ?? null
}

export async function setSession(userId: string) {
  const store = await cookies()
  store.set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSession() {
  const store = await cookies()
  store.delete(COOKIE)
}

export function dashboardPath(role: string) {
  switch (role) {
    case "agent":
      return "/agent"
    case "business":
      return "/business"
    case "admin":
      return "/admin"
    default:
      return "/student"
  }
}
