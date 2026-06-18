"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

async function myBusiness() {
  const user = await getCurrentUser()
  if (!user || user.role !== "business") return null
  const rows = (await sql`SELECT id FROM business_profiles WHERE user_id = ${user.id} LIMIT 1`) as {
    id: string
  }[]
  return rows[0]?.id ?? null
}

export async function saveProduct(formData: FormData) {
  const businessId = await myBusiness()
  if (!businessId) return { error: "Not authorized" }

  const id = String(formData.get("id") || "")
  const name = String(formData.get("name") || "").trim()
  const category = String(formData.get("category") || "Food")
  const price = Number(formData.get("price") || 0)
  const description = String(formData.get("description") || "")
  const image_url = String(formData.get("image_url") || "") || "/products/jollof-rice.png"
  const stock = Number(formData.get("stock") || 0)
  const delivery_time = String(formData.get("delivery_time") || "20-30 min")

  if (!name || price <= 0) return { error: "Name and price are required" }

  if (id) {
    await sql`
      UPDATE products SET name=${name}, category=${category}, price=${price},
        description=${description}, image_url=${image_url}, stock=${stock}, delivery_time=${delivery_time}
      WHERE id=${id} AND business_id=${businessId}
    `
  } else {
    await sql`
      INSERT INTO products (business_id, name, category, price, description, image_url, stock, delivery_time)
      VALUES (${businessId}, ${name}, ${category}, ${price}, ${description}, ${image_url}, ${stock}, ${delivery_time})
    `
  }
  revalidatePath("/business")
  return { ok: true }
}

export async function deleteProduct(productId: string) {
  const businessId = await myBusiness()
  if (!businessId) return { error: "Not authorized" }
  await sql`DELETE FROM products WHERE id=${productId} AND business_id=${businessId}`
  revalidatePath("/business")
  return { ok: true }
}

export async function updateStoreProfile(formData: FormData) {
  const businessId = await myBusiness()
  if (!businessId) return { error: "Not authorized" }
  const store_name = String(formData.get("store_name") || "").trim()
  const description = String(formData.get("description") || "")
  const category = String(formData.get("category") || "Food")
  await sql`
    UPDATE business_profiles SET store_name=${store_name}, description=${description}, category=${category}
    WHERE id=${businessId}
  `
  revalidatePath("/business")
  return { ok: true }
}

export async function changeSubscription(plan: string) {
  const businessId = await myBusiness()
  if (!businessId) return { error: "Not authorized" }
  const price = plan === "premium" ? 5000 : plan === "pro" ? 2500 : 0
  await sql`UPDATE business_profiles SET subscription_plan=${plan} WHERE id=${businessId}`
  await sql`
    INSERT INTO subscriptions (business_id, plan, price, status, renews_at)
    VALUES (${businessId}, ${plan}, ${price}, 'active', now() + interval '30 days')
  `
  revalidatePath("/business")
  return { ok: true }
}

// Admin moderation
export async function moderateProduct(productId: string, status: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") return { error: "Not authorized" }
  await sql`UPDATE products SET status=${status} WHERE id=${productId}`
  revalidatePath("/admin")
  return { ok: true }
}

export async function setUserStatus(userId: string, status: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") return { error: "Not authorized" }
  await sql`UPDATE app_users SET status=${status} WHERE id=${userId}`
  revalidatePath("/admin")
  return { ok: true }
}

export async function resolveDispute(disputeId: string, status: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") return { error: "Not authorized" }
  await sql`UPDATE disputes SET status=${status} WHERE id=${disputeId}`
  revalidatePath("/admin")
  return { ok: true }
}
