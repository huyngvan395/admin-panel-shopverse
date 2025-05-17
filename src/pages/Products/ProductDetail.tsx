"use client"

import type React from "react"

import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { deleteProduct, fetchProductById } from "../../features/products/productSlice"
import { Loader } from "../../components/common/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { formatCurrency, formatDate, getStatusColor } from "../../utils"
import { useState } from "react"
import { Modal } from "../../components/common/Modal"
import { ToastNotification } from "../../components/common/ToastNotification"

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentProduct, loading, error } = useAppSelector((state) => state.products)
  const { user } = useAppSelector((state) => state.auth)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")

  const isEditor = user?.role === "admin" || user?.role === "editor"

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteProduct(id)).unwrap()
        setToastMessage("Product deleted successfully")
        setToastType("success")
        setToastOpen(true)
        setTimeout(() => {
          navigate("/products")
        }, 1500)
      } catch {
        setToastMessage("Failed to delete product")
        setToastType("error")
        setToastOpen(true)
      }
      setDeleteModalOpen(false)
    }
  }

  if (loading || !currentProduct) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Product Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>View detailed information about this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Name</span>
              <span className="font-medium">{currentProduct.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Description</span>
              <p>{currentProduct.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Category</span>
              <span>{currentProduct.category}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Price</span>
                <span className="font-bold text-primary">{formatCurrency(currentProduct.price)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Stock</span>
                <span>{currentProduct.stock} units</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge className={getStatusColor(currentProduct.status)}>{currentProduct.status}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Created</span>
                <span>{formatDate(currentProduct.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md">
                <img
                  src={currentProduct.image || "/placeholder.svg?height=300&width=500"}
                  alt={currentProduct.name}
                  className="h-[300px] w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {isEditor && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button className="flex-1 text-white" asChild>
                  <Link to={`/products/edit/${currentProduct.id}`} className="text-white">
                    <Edit className="mr-2 h-4 w-4 text-white" /> Edit Product
                  </Link>
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setDeleteModalOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Modal
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastNotification message={toastMessage} type={toastType} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  )
}

export default ProductDetail
