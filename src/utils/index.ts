// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// Format date with time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random ID (for demo purposes)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Get status color based on status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
    case "in-stock":
    case "delivered":
    case "paid":
      return "bg-green-100 text-green-800"
    case "inactive":
    case "out-of-stock":
    case "cancelled":
    case "failed":
    case "refunded":
      return "bg-red-100 text-red-800"
    case "low-stock":
    case "processing":
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Get role color
export const getRoleColor = (role: string): string => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800"
    case "editor":
      return "bg-blue-100 text-blue-800"
    case "viewer":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Get order status label
export const getOrderStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pending"
    case "processing":
      return "Processing"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Delivered"
    case "cancelled":
      return "Cancelled"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}
