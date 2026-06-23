'use server'

import { sql } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

/**
 * Process payment when student places an order
 * Money is held in escrow (held_balance) until delivery is confirmed
 */
export async function processOrderPayment(orderId: string, amount: number, studentId: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'student') {
    throw new Error('Unauthorized: Only students can place orders')
  }

  try {
    // Check if student has sufficient balance
    const wallets = (await sql`
      SELECT balance FROM wallets WHERE user_id = ${studentId}
    `) as any[]

    if (!wallets[0] || wallets[0].balance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Deduct from available balance and add to held balance
    await sql`
      UPDATE wallets 
      SET balance = balance - ${amount}, 
          held_balance = held_balance + ${amount}
      WHERE user_id = ${studentId}
    `

    // Record transaction
    await sql`
      INSERT INTO transaction_logs (user_id, order_id, transaction_type, amount, description, status)
      VALUES (${studentId}, ${orderId}, 'payment', ${amount}, 'Order payment held in escrow', 'completed')
    `

    // Update order payment status
    await sql`
      UPDATE orders SET payment_status = 'paid' WHERE id = ${orderId}
    `

    return { success: true, message: 'Payment processed successfully' }
  } catch (error) {
    console.error('Payment error:', error)
    throw error
  }
}

/**
 * Release escrow payment to business when delivery is confirmed
 */
export async function releaseEscrowPayment(orderId: string, businessId: string, amount: number) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can release escrow payments')
  }

  try {
    // Get order details
    const orders = (await sql`
      SELECT student_id FROM orders WHERE id = ${orderId}
    `) as any[]

    if (!orders[0]) {
      throw new Error('Order not found')
    }

    const studentId = orders[0].student_id

    // Release held balance from student wallet
    await sql`
      UPDATE wallets 
      SET held_balance = held_balance - ${amount}
      WHERE user_id = ${studentId}
    `

    // Add funds to business wallet
    await sql`
      UPDATE wallets 
      SET balance = balance + ${amount}, total_earned = total_earned + ${amount}
      WHERE user_id = ${businessId}
    `

    // Record transaction for business
    await sql`
      INSERT INTO transaction_logs (user_id, order_id, transaction_type, amount, description, status)
      VALUES (${businessId}, ${orderId}, 'payout', ${amount}, 'Order delivery confirmed - payment released', 'completed')
    `

    // Update order status
    await sql`
      UPDATE orders SET payment_status = 'completed' WHERE id = ${orderId}
    `

    return { success: true, message: 'Escrow payment released successfully' }
  } catch (error) {
    console.error('Escrow release error:', error)
    throw error
  }
}

/**
 * Refund payment if order is cancelled or has dispute
 */
export async function refundPayment(orderId: string, studentId: string, amount: number, reason: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    // Release held balance back to available balance
    await sql`
      UPDATE wallets 
      SET balance = balance + ${amount}, 
          held_balance = held_balance - ${amount}
      WHERE user_id = ${studentId}
    `

    // Record refund transaction
    await sql`
      INSERT INTO transaction_logs (user_id, order_id, transaction_type, amount, description, status)
      VALUES (${studentId}, ${orderId}, 'refund', ${amount}, ${reason}, 'completed')
    `

    // Update order payment status
    await sql`
      UPDATE orders SET payment_status = 'refunded' WHERE id = ${orderId}
    `

    return { success: true, message: 'Refund processed successfully' }
  } catch (error) {
    console.error('Refund error:', error)
    throw error
  }
}

/**
 * Get wallet balance for user
 */
export async function getWalletBalance(userId: string) {
  try {
    const wallets = (await sql`
      SELECT balance, held_balance, total_earned FROM wallets WHERE user_id = ${userId}
    `) as any[]

    if (!wallets[0]) {
      throw new Error('Wallet not found')
    }

    return wallets[0]
  } catch (error) {
    console.error('Wallet error:', error)
    throw error
  }
}

/**
 * Get transaction history for user
 */
export async function getTransactionHistory(userId: string, limit: number = 20) {
  try {
    const transactions = (await sql`
      SELECT * FROM transaction_logs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as any[]

    return transactions
  } catch (error) {
    console.error('Transaction history error:', error)
    throw error
  }
}
