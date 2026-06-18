"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { setSession, clearSession, dashboardPath } from "@/lib/auth"
import type { Role } from "@/lib/types"

export async function registerUser(formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim()
  const role = String(formData.get("role") || "student") as Role
  if (!fullName) return { error: "Please enter your full name" }

  const rows = (await sql`
    INSERT INTO app_users (full_name, role, wallet_balance)
    VALUES (${fullName}, ${role}, ${role === "student" ? 2000 : 0})
    RETURNING id, role
  `) as { id: string; role: string }[]

  const user = rows[0]

  if (role === "student") {
    await sql`INSERT INTO student_profiles (user_id) VALUES (${user.id}) ON CONFLICT DO NOTHING`
  } else if (role === "agent") {
    await sql`INSERT INTO delivery_agent_profiles (user_id) VALUES (${user.id}) ON CONFLICT DO NOTHING`
  } else if (role === "business") {
    await sql`
      INSERT INTO business_profiles (user_id, store_name, category)
      VALUES (${user.id}, ${fullName + "'s Store"}, 'Food')
    `
  }

  await setSession(user.id)
  redirect(dashboardPath(user.role))
}

export async function loginUser(userId: string) {
  const rows = (await sql`SELECT id, role FROM app_users WHERE id = ${userId} LIMIT 1`) as {
    id: string
    role: string
  }[]
  if (!rows[0]) return { error: "Account not found" }
  await setSession(rows[0].id)
  redirect(dashboardPath(rows[0].role))
}

export async function logout() {
  await clearSession()
  redirect("/")
}

export async function getAccountsByRole(role: Role) {
  const rows = (await sql`
    SELECT id, full_name, avatar_url FROM app_users
    WHERE role = ${role} AND status = 'active'
    ORDER BY created_at DESC LIMIT 30
  `) as { id: string; full_name: string; avatar_url: string | null }[]
  return rows
}
