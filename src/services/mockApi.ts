import type {
  LoginCredentials,
  Product,
  RegisterData,
  User,
  UserFormData,
  ProductFormData,
  ApiResponse,
  AuthUser,
  Order,
  OrderStatusUpdate,
} from "../types"

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date().toISOString(),
    status: "active",
  },
  {
    id: "2",
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date().toISOString(),
    status: "active",
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    createdAt: new Date().toISOString(),
    status: "inactive",
  },
]

const products: Product[] = [
  {
    id: "1",
    name: "Smartphone X",
    description: "Latest smartphone with advanced features",
    price: 999.99,
    category: "Electronics",
    stock: 50,
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1499.99,
    category: "Electronics",
    stock: 25,
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "3",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling headphones",
    price: 299.99,
    category: "Audio",
    stock: 5,
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date().toISOString(),
    status: "low-stock",
  },
  {
    id: "4",
    name: "Smart Watch",
    description: "Fitness and health tracking smartwatch",
    price: 199.99,
    category: "Wearables",
    stock: 0,
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date().toISOString(),
    status: "out-of-stock",
  },
]

// Mock orders data
const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    items: [
      {
        id: "ITEM-001",
        productId: "1",
        productName: "Smartphone X",
        quantity: 1,
        price: 999.99,
        subtotal: 999.99,
      },
      {
        id: "ITEM-002",
        productId: "3",
        productName: "Wireless Headphones",
        quantity: 1,
        price: 299.99,
        subtotal: 299.99,
      },
    ],
    total: 1299.98,
    status: "pending",
    paymentStatus: "paid",
    shippingAddress: "123 Main St, Anytown, USA",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    items: [
      {
        id: "ITEM-003",
        productId: "2",
        productName: "Laptop Pro",
        quantity: 1,
        price: 1499.99,
        subtotal: 1499.99,
      },
    ],
    total: 1499.99,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "456 Oak Ave, Somewhere, USA",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-003",
    customerId: "CUST-003",
    customerName: "Robert Johnson",
    customerEmail: "robert.johnson@example.com",
    items: [
      {
        id: "ITEM-004",
        productId: "4",
        productName: "Smart Watch",
        quantity: 2,
        price: 199.99,
        subtotal: 399.98,
      },
      {
        id: "ITEM-005",
        productId: "3",
        productName: "Wireless Headphones",
        quantity: 1,
        price: 299.99,
        subtotal: 299.99,
      },
    ],
    total: 699.97,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "789 Pine Rd, Elsewhere, USA",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-004",
    customerId: "CUST-004",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@example.com",
    items: [
      {
        id: "ITEM-006",
        productId: "1",
        productName: "Smartphone X",
        quantity: 1,
        price: 999.99,
        subtotal: 999.99,
      },
    ],
    total: 999.99,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "101 Maple St, Nowhere, USA",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-005",
    customerId: "CUST-005",
    customerName: "Michael Wilson",
    customerEmail: "michael.wilson@example.com",
    items: [
      {
        id: "ITEM-007",
        productId: "2",
        productName: "Laptop Pro",
        quantity: 1,
        price: 1499.99,
        subtotal: 1499.99,
      },
      {
        id: "ITEM-008",
        productId: "3",
        productName: "Wireless Headphones",
        quantity: 2,
        price: 299.99,
        subtotal: 599.98,
      },
    ],
    total: 2099.97,
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: "202 Cedar Blvd, Anywhere, USA",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Auth Service
export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    await delay(800) // Simulate network delay

    const user = users.find((u) => u.email === credentials.email)

    if (!user || credentials.password !== "password") {
      // Simple password check for demo
      throw new Error("Invalid credentials")
    }

    const { id, name, email, role, avatar } = user
    const authUser: AuthUser = { id, name, email, role, avatar }
    const token = `mock-jwt-token-${id}`

    // Store in localStorage to persist session
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(authUser))

    return {
      data: { user: authUser, token },
      message: "Login successful",
      success: true,
    }
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    await delay(800)

    if (users.some((u) => u.email === data.email)) {
      throw new Error("Email already in use")
    }

    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match")
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name: data.name,
      email: data.email,
      role: "viewer", // Default role for new registrations
      createdAt: new Date().toISOString(),
      status: "active",
    }

    users.push(newUser)

    const { id, name, email, role, avatar } = newUser
    const authUser: AuthUser = { id, name, email, role, avatar }
    const token = `mock-jwt-token-${id}`

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(authUser))

    return {
      data: { user: authUser, token },
      message: "Registration successful",
      success: true,
    }
  },

  logout: async (): Promise<void> => {
    await delay(300)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    await delay(300)

    const userJson = localStorage.getItem("user")
    if (!userJson) {
      throw new Error("Not authenticated")
    }

    const user = JSON.parse(userJson) as AuthUser

    return {
      data: user,
      message: "User retrieved successfully",
      success: true,
    }
  },
}

// Mock User Service
export const mockUserService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    await delay(800)
    return {
      data: [...users],
      message: "Users retrieved successfully",
      success: true,
    }
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    await delay(500)
    const user = users.find((u) => u.id === id)

    if (!user) {
      throw new Error("User not found")
    }

    return {
      data: { ...user },
      message: "User retrieved successfully",
      success: true,
    }
  },

  createUser: async (userData: UserFormData): Promise<ApiResponse<User>> => {
    await delay(800)

    if (users.some((u) => u.email === userData.email)) {
      throw new Error("Email already in use")
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return {
      data: newUser,
      message: "User created successfully",
      success: true,
    }
  },

  updateUser: async (id: string, userData: UserFormData): Promise<ApiResponse<User>> => {
    await delay(800)

    const index = users.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }

    // Check if email is being changed and is already in use
    if (userData.email !== users[index].email && users.some((u) => u.email === userData.email)) {
      throw new Error("Email already in use")
    }

    const updatedUser = {
      ...users[index],
      ...userData,
    }

    users[index] = updatedUser

    return {
      data: updatedUser,
      message: "User updated successfully",
      success: true,
    }
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    await delay(800)

    const index = users.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }

    users.splice(index, 1)

    return {
      data: null,
      message: "User deleted successfully",
      success: true,
    }
  },
}

// Mock Product Service
export const mockProductService = {
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    await delay(800)
    return {
      data: [...products],
      message: "Products retrieved successfully",
      success: true,
    }
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    await delay(500)
    const product = products.find((p) => p.id === id)

    if (!product) {
      throw new Error("Product not found")
    }

    return {
      data: { ...product },
      message: "Product retrieved successfully",
      success: true,
    }
  },

  createProduct: async (productData: ProductFormData): Promise<ApiResponse<Product>> => {
    await delay(800)

    const newProduct: Product = {
      id: (products.length + 1).toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      image: "/placeholder.svg?height=100&width=100",
    }

    products.push(newProduct)

    return {
      data: newProduct,
      message: "Product created successfully",
      success: true,
    }
  },

  updateProduct: async (id: string, productData: ProductFormData): Promise<ApiResponse<Product>> => {
    await delay(800)

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }

    const updatedProduct = {
      ...products[index],
      ...productData,
    }

    products[index] = updatedProduct

    return {
      data: updatedProduct,
      message: "Product updated successfully",
      success: true,
    }
  },

  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    await delay(800)

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }

    products.splice(index, 1)

    return {
      data: null,
      message: "Product deleted successfully",
      success: true,
    }
  },
}

// Mock Order Service
export const mockOrderService = {
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    await delay(800)
    return {
      data: [...orders],
      message: "Orders retrieved successfully",
      success: true,
    }
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    await delay(500)
    const order = orders.find((o) => o.id === id)

    if (!order) {
      throw new Error("Order not found")
    }

    return {
      data: { ...order },
      message: "Order retrieved successfully",
      success: true,
    }
  },

  updateOrderStatus: async (id: string, statusUpdate: OrderStatusUpdate): Promise<ApiResponse<Order>> => {
    await delay(800)

    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) {
      throw new Error("Order not found")
    }

    const updatedOrder = {
      ...orders[index],
      status: statusUpdate.status,
      updatedAt: new Date().toISOString(),
    }

    orders[index] = updatedOrder

    return {
      data: updatedOrder,
      message: "Order status updated successfully",
      success: true,
    }
  },
}
