import { sql } from "@/lib/db"
import type { Product, Order, Business } from "@/lib/types"

export async function getProducts(opts?: {
  category?: string
  search?: string
  limit?: number
}): Promise<Product[]> {
  const limit = opts?.limit ?? 60
  const cat = opts?.category && opts.category !== "All" ? opts.category : null
  const search = opts?.search ? `%${opts.search.toLowerCase()}%` : null

  const rows = (await sql`
    SELECT p.id, p.business_id, p.name, p.category, p.price::float AS price, p.description,
           p.image_url, p.delivery_time, p.rating::float AS rating, p.is_popular, p.is_trending,
           p.stock, p.status, b.store_name
    FROM products p
    JOIN business_profiles b ON b.id = p.business_id
    WHERE p.status = 'active'
      AND (${cat}::text IS NULL OR p.category = ${cat})
      AND (${search}::text IS NULL OR lower(p.name) LIKE ${search} OR lower(b.store_name) LIKE ${search})
    ORDER BY p.is_trending DESC, p.rating DESC
    LIMIT ${limit}
  `) as Product[]
  return rows
}

export async function getProduct(id: string): Promise<Product | null> {
  const rows = (await sql`
    SELECT p.id, p.business_id, p.name, p.category, p.price::float AS price, p.description,
           p.image_url, p.delivery_time, p.rating::float AS rating, p.is_popular, p.is_trending,
           p.stock, p.status, b.store_name
    FROM products p JOIN business_profiles b ON b.id = p.business_id
    WHERE p.id = ${id} LIMIT 1
  `) as Product[]
  return rows[0] ?? null
}

export async function getBusinesses(): Promise<Business[]> {
  return (await sql`
    SELECT id, user_id, store_name, short_code, description, category, image_url,
           rating::float AS rating, subscription_plan, subscription_status
    FROM business_profiles ORDER BY rating DESC
  `) as Business[]
}

export async function getStudentOrders(studentId: string): Promise<Order[]> {
  const orders = (await sql`
    SELECT o.id, o.status, o.subtotal::float AS subtotal, o.delivery_fee::float AS delivery_fee,
           o.total::float AS total, o.delivery_address, o.created_at, o.agent_id,
           b.store_name, a.full_name AS agent_name
    FROM orders o
    LEFT JOIN business_profiles b ON b.id = o.business_id
    LEFT JOIN app_users a ON a.id = o.agent_id
    WHERE o.student_id = ${studentId}
    ORDER BY o.created_at DESC
  `) as Order[]
  return attachItems(orders)
}

export async function getAvailableOrders(): Promise<Order[]> {
  const orders = (await sql`
    SELECT o.id, o.status, o.subtotal::float AS subtotal, o.delivery_fee::float AS delivery_fee,
           o.total::float AS total, o.delivery_address, o.created_at,
           b.store_name, s.full_name AS student_name
    FROM orders o
    LEFT JOIN business_profiles b ON b.id = o.business_id
    LEFT JOIN app_users s ON s.id = o.student_id
    WHERE o.agent_id IS NULL AND o.status = 'paid'
    ORDER BY o.created_at DESC
  `) as Order[]
  return attachItems(orders)
}

export async function getAgentOrders(agentId: string): Promise<Order[]> {
  const orders = (await sql`
    SELECT o.id, o.status, o.subtotal::float AS subtotal, o.delivery_fee::float AS delivery_fee,
           o.total::float AS total, o.delivery_address, o.created_at,
           b.store_name, s.full_name AS student_name
    FROM orders o
    LEFT JOIN business_profiles b ON b.id = o.business_id
    LEFT JOIN app_users s ON s.id = o.student_id
    WHERE o.agent_id = ${agentId}
    ORDER BY o.created_at DESC
  `) as Order[]
  return attachItems(orders)
}

export async function getBusinessOrders(businessId: string): Promise<Order[]> {
  const orders = (await sql`
    SELECT o.id, o.status, o.subtotal::float AS subtotal, o.delivery_fee::float AS delivery_fee,
           o.total::float AS total, o.delivery_address, o.created_at,
           s.full_name AS student_name, a.full_name AS agent_name
    FROM orders o
    LEFT JOIN app_users s ON s.id = o.student_id
    LEFT JOIN app_users a ON a.id = o.agent_id
    WHERE o.business_id = ${businessId}
    ORDER BY o.created_at DESC
  `) as Order[]
  return attachItems(orders)
}

async function attachItems(orders: Order[]): Promise<Order[]> {
  for (const o of orders) {
    o.items = (await sql`
      SELECT name, price::float AS price, quantity FROM order_items WHERE order_id = ${o.id}
    `) as { name: string; price: number; quantity: number }[]
  }
  return orders
}

export async function getMyBusiness(userId: string): Promise<Business | null> {
  const rows = (await sql`
    SELECT id, user_id, store_name, short_code, description, category, image_url,
           rating::float AS rating, subscription_plan, subscription_status
    FROM business_profiles WHERE user_id = ${userId} LIMIT 1
  `) as Business[]
  return rows[0] ?? null
}

export async function getBusinessProducts(businessId: string): Promise<Product[]> {
  return (await sql`
    SELECT id, business_id, name, category, price::float AS price, description, image_url,
           delivery_time, rating::float AS rating, is_popular, is_trending, stock, status
    FROM products WHERE business_id = ${businessId} ORDER BY created_at DESC
  `) as Product[]
}

export async function getWalletTransactions(userId: string) {
  return (await sql`
    SELECT id, amount::float AS amount, type, description, created_at
    FROM wallet_transactions WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT 50
  `) as { id: string; amount: number; type: string; description: string; created_at: string }[]
}

export async function getCustomRequests(studentId: string) {
  return (await sql`
    SELECT id, title, description, budget::float AS budget, status, created_at
    FROM custom_requests WHERE student_id = ${studentId} ORDER BY created_at DESC
  `) as { id: string; title: string; description: string; budget: number; status: string; created_at: string }[]
}
