"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchOrderById, updateOrderStatus } from "../../features/orders/orderSlice"
import { Loader } from "../../components/common/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, User } from "lucide-react"
import { formatCurrency, formatDateTime, getStatusColor } from "../../utils"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order } from "../../types"

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { currentOrder, loading, error } = useAppSelector((state) => state.orders)
  const { user } = useAppSelector((state) => state.auth)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "">("")
  const [updating, setUpdating] = useState(false)

  const isEditor = user?.role === "admin" || user?.role === "editor"

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentOrder) {
      setSelectedStatus(currentOrder.status)
    }
  }, [currentOrder])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const handleStatusChange = async () => {
    if (!id || !selectedStatus || selectedStatus === currentOrder?.status) return

    setUpdating(true)
    try {
      await dispatch(
        updateOrderStatus({
          id,
          statusUpdate: { status: selectedStatus },
        }),
      ).unwrap()
      setToastMessage("Order status updated successfully")
      setToastType("success")
      setToastOpen(true)
    } catch (error) {
      setToastMessage(typeof error === "string" ? error : "Failed to update order status")
      setToastType("error")
      setToastOpen(true)
    } finally {
      setUpdating(false)
    }
  }

  if (loading || !currentOrder) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">Order {currentOrder.id}</CardTitle>
                <CardDescription>Placed on {formatDateTime(currentOrder.createdAt)}</CardDescription>
              </div>
              <Badge className={getStatusColor(currentOrder.status)}>{currentOrder.status}</Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(currentOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Shipping Address</p>
                  <p className="text-muted-foreground">{currentOrder.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{currentOrder.customerName}</p>
                  <p className="text-muted-foreground">{currentOrder.customerEmail}</p>
                  <p className="text-sm text-muted-foreground mt-1">Customer ID: {currentOrder.customerId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(currentOrder.paymentStatus)}>{currentOrder.paymentStatus}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">{formatCurrency(currentOrder.total)}</span>
              </div>
            </CardContent>
          </Card>

          {isEditor && (
            <Card>
              <CardHeader>
                <CardTitle>Update Order Status</CardTitle>
                <CardDescription>Change the current status of this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Order["status"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleStatusChange}
                  disabled={updating || selectedStatus === currentOrder.status}
                  className="w-full"
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      <ToastNotification message={toastMessage} type={toastType} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  )
}

export default OrderDetail
