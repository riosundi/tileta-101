"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { getCart, clearCart } from "@/lib/actions/cart"
import { DELIVERY_FEE, COMMISSION_RATE } from "@/lib/types"

export async function placeOrder(deliveryAddress: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== "student") return { error: "Not authorized" }

  const cart = await getCart()
  if (cart.length === 0) return { error: "Your cart is empty" }

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0)
  const total = subtotal + DELIVERY_FEE
  if (Number(user.wallet_balance) < total) {
    return { error: "Insufficient wallet balance. Please top up." }
  }

  const businessId = cart[0].business_id
  const commission = subtotal * COMMISSION_RATE

  const orderRows = (await sql`
    INSERT INTO orders (student_id, business_id, status, subtotal, delivery_fee, commission, total, delivery_address)
    VALUES (${user.id}, ${businessId}, 'paid', ${subtotal}, ${DELIVERY_FEE}, ${commission}, ${total}, ${deliveryAddress})
    RETURNING id
  `) as { id: string }[]
  const orderId = orderRows[0].id

  for (const item of cart) {
    await sql`
      INSERT INTO order_items (order_id, product_id, name, price, quantity)
      VALUES (${orderId}, ${item.productId}, ${item.name}, ${item.price}, ${item.quantity})
    `
  }

  await sql`
    INSERT INTO payments (order_id, amount, method, status)
    VALUES (${orderId}, ${total}, 'wallet', 'completed')
  `
  await sql`UPDATE app_users SET wallet_balance = wallet_balance - ${total} WHERE id = ${user.id}`
  await sql`
    INSERT INTO wallet_transactions (user_id, amount, type, description)
    VALUES (${user.id}, ${-total}, 'purchase', ${"Order " + orderId.slice(0, 8)})
  `
  await sql`
    INSERT INTO notifications (user_id, title, message)
    VALUES (${user.id}, 'Order placed', ${"Your order #" + orderId.slice(0, 8) + " was placed successfully."})
  `

  await clearCart()
  revalidatePath("/student/orders")
  revalidatePath("/agent")
  return { ok: true, orderId }
}

export async function acceptOrder(orderId: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== "agent") return { error: "Not authorized" }
  await sql`
    UPDATE orders SET status = 'accepted', agent_id = ${user.id}, updated_at = now()
    WHERE id = ${orderId} AND agent_id IS NULL AND status = 'paid'
  `
  revalidatePath("/agent")
  return { ok: true }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authorized" }

  await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${orderId}`

  if (status === "delivered") {
    const rows = (await sql`
      SELECT agent_id, delivery_fee::float AS delivery_fee FROM orders WHERE id = ${orderId} LIMIT 1
    `) as { agent_id: string | null; delivery_fee: number }[]
    const o = rows[0]
    if (o?.agent_id) {
      await sql`
        INSERT INTO payouts (agent_id, order_id, amount, status)
        VALUES (${o.agent_id}, ${orderId}, ${o.delivery_fee}, 'paid')
      `
      await sql`
        UPDATE delivery_agent_profiles SET total_earnings = total_earnings + ${o.delivery_fee}
        WHERE user_id = ${o.agent_id}
      `
      await sql`UPDATE app_users SET wallet_balance = wallet_balance + ${o.delivery_fee} WHERE id = ${o.agent_id}`
    }
  }
  revalidatePath("/agent")
  revalidatePath("/student/orders")
  revalidatePath("/business")
  return { ok: true }
}

export async function topUpWallet(amount: number) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authorized" }
  await sql`UPDATE app_users SET wallet_balance = wallet_balance + ${amount} WHERE id = ${user.id}`
  await sql`
    INSERT INTO wallet_transactions (user_id, amount, type, description)
    VALUES (${user.id}, ${amount}, 'topup', 'Wallet top up')
  `
  revalidatePath("/student/wallet")
  revalidatePath("/student")
  return { ok: true }
}

export async function createCustomRequest(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authorized" }
  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const budget = Number(formData.get("budget") || 0)
  if (!title) return { error: "Title required" }
  await sql`
    INSERT INTO custom_requests (student_id, title, description, budget)
    VALUES (${user.id}, ${title}, ${description}, ${budget})
  `
  revalidatePath("/student/requests")
  return { ok: true }
}

export async function raiseDispute(orderId: string, reason: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authorized" }
  await sql`
    INSERT INTO disputes (order_id, raised_by, reason)
    VALUES (${orderId}, ${user.id}, ${reason})
  `
  revalidatePath("/student/orders")
  revalidatePath("/admin")
  return { ok: true }
}
