"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import type { CartItem } from "@/lib/types"

const CART = "tileta_cart"

export async function getCart(): Promise<CartItem[]> {
  const store = await cookies()
  const raw = store.get(CART)?.value
  if (!raw) return []
  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

async function saveCart(items: CartItem[]) {
  const store = await cookies()
  store.set(CART, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function addToCart(productId: string, quantity = 1) {
  const rows = (await sql`
    SELECT id, name, price::float AS price, image_url, business_id
    FROM products WHERE id = ${productId} LIMIT 1
  `) as { id: string; name: string; price: number; image_url: string | null; business_id: string }[]
  const p = rows[0]
  if (!p) return { error: "Product not found" }

  const cart = await getCart()
  const existing = cart.find((c) => c.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      productId: p.id,
      name: p.name,
      price: p.price,
      quantity,
      image_url: p.image_url,
      business_id: p.business_id,
    })
  }
  await saveCart(cart)
  revalidatePath("/student/cart")
  revalidatePath("/student")
  return { ok: true, count: cart.reduce((s, c) => s + c.quantity, 0) }
}

export async function updateCartQty(productId: string, quantity: number) {
  let cart = await getCart()
  if (quantity <= 0) {
    cart = cart.filter((c) => c.productId !== productId)
  } else {
    const item = cart.find((c) => c.productId === productId)
    if (item) item.quantity = quantity
  }
  await saveCart(cart)
  revalidatePath("/student/cart")
}

export async function removeFromCart(productId: string) {
  const cart = (await getCart()).filter((c) => c.productId !== productId)
  await saveCart(cart)
  revalidatePath("/student/cart")
}

export async function clearCart() {
  await saveCart([])
}
