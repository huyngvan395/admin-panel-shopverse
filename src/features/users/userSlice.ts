import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User, UserFormData } from "../../types"
import { mockUserService } from "../../services/mockApi"

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await mockUserService.getUsers()
    return response.data
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to fetch users")
    }
    return rejectWithValue("Failed to fetch users")
  }
})

export const fetchUserById = createAsyncThunk("users/fetchUserById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await mockUserService.getUserById(id)
    return response.data
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to fetch user")
    }
    return rejectWithValue("Failed to fetch user")
  }
})

export const createUser = createAsyncThunk("users/createUser", async (userData: UserFormData, { rejectWithValue }) => {
  try {
    const response = await mockUserService.createUser(userData)
    return response.data
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to create user")
    }
    return rejectWithValue("Failed to create user")
  }
})

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: string; userData: UserFormData }, { rejectWithValue }) => {
    try {
      const response = await mockUserService.updateUser(id, userData)
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update user")
      }
      return rejectWithValue("Failed to update user")
    }
  }
)

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: string, { rejectWithValue }) => {
  try {
    await mockUserService.deleteUser(id)
    return id
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to delete user")
    }
    return rejectWithValue("Failed to delete user")
  }
})

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        const index: number = state.users.findIndex((u: User) => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
        state.currentUser = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.users = state.users.filter((u: User) => u.id !== action.payload)
        if (state.currentUser && state.currentUser.id === action.payload) {
          state.currentUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentUser, clearError } = userSlice.actions
export default userSlice.reducer
