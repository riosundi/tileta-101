export type Role = "student" | "agent" | "business" | "admin"

export type AppUser = {
  id: string
  full_name: string
  role: Role
  wallet_balance: number
  avatar_url: string | null
  status: string
  created_at: string
}

export type Business = {
  id: string
  user_id: string
  store_name: string
  short_code: string | null
  description: string | null
  category: string
  image_url: string | null
  rating: number
  subscription_plan: string
  subscription_status: string
}

export type Product = {
  id: string
  business_id: string
  name: string
  category: string
  price: number
  description: string | null
  image_url: string | null
  delivery_time: string | null
  rating: number
  is_popular: boolean
  is_trending: boolean
  stock: number
  status: string
  store_name?: string
}

export type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image_url: string | null
  business_id: string
}

export type Order = {
  id: string
  student_id: string | null
  business_id: string | null
  agent_id: string | null
  status: string
  subtotal: number
  delivery_fee: number
  commission: number
  total: number
  delivery_address: string | null
  receipt_url: string | null
  created_at: string
  store_name?: string
  student_name?: string
  agent_name?: string
  items?: { name: string; price: number; quantity: number }[]
}

export const CATEGORIES = [
  "Food",
  "Groceries",
  "Study Materials",
  "Electronics",
  "Fashion",
] as const

export const DELIVERY_FEE = 500
export const COMMISSION_RATE = 0.1
