import axios from "axios"
import type {
  ApiResponse,
  LoginCredentials,
  Product,
  RegisterData,
  User,
  UserFormData,
  ProductFormData,
} from "../types"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:3001/api", // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    // In a real app, this would be an actual API call
    // For demo purposes, we're simulating a successful login
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

// User services
export const userService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get("/users")
    return response.data
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: UserFormData): Promise<ApiResponse<User>> => {
    const response = await api.post("/users", userData)
    return response.data
  },

  updateUser: async (id: string, userData: UserFormData): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

// Product services
export const productService = {
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get("/products")
    return response.data
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (productData: ProductFormData): Promise<ApiResponse<Product>> => {
    const response = await api.post("/products", productData)
    return response.data
  },

  updateProduct: async (id: string, productData: ProductFormData): Promise<ApiResponse<Product>> => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

export default api
