import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Order, OrderStatusUpdate } from "../../types"
import { mockOrderService } from "../../services/mockApi"

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await mockOrderService.getOrders()
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders"
    return rejectWithValue(message)
  }
})

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await mockOrderService.getOrderById(id)
    return response.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order"
    return rejectWithValue(message)
  }
  }
)

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, statusUpdate }: { id: string; statusUpdate: OrderStatusUpdate }, { rejectWithValue }) => {
    try {
      const response = await mockOrderService.updateOrderStatus(id, statusUpdate)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update order status"
      return rejectWithValue(message)
    }
  },
)

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Order By Id
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        const index = state.orders.findIndex((o) => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        state.currentOrder = action.payload
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentOrder, clearError } = orderSlice.actions
export default orderSlice.reducer
