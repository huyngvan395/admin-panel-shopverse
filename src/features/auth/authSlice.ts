import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthUser, LoginCredentials, RegisterData } from "../../types"
import { mockAuthService } from "../../services/mockApi"

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await mockAuthService.login(credentials)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed"
    return rejectWithValue(message)
  }
})

export const register = createAsyncThunk("auth/register", async (data: RegisterData, { rejectWithValue }) => {
  try {
    const response = await mockAuthService.register(data)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed"
    return rejectWithValue(message)
  }
  })

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    // You can add any logout logic here if needed, e.g., mockAuthService.logout()
    return;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout failed";
    return rejectWithValue(message);
  }
})

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await mockAuthService.getCurrentUser();
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get current user";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
