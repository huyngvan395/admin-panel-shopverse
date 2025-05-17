// Common types used throughout the application

// User related types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  avatar?: string
  createdAt: string
  status: "active" | "inactive"
}

export interface UserFormData {
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  password?: string
  status: "active" | "inactive"
}

// Product related types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  image?: string
  createdAt: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  stock: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

// Order related types
export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export interface OrderStatusUpdate {
  status: Order["status"]
}

// Authentication related types
export interface AuthUser {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// API response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
