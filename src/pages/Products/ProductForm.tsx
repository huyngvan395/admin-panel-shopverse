"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  createProduct,
  fetchProductById,
  updateProduct,
  clearCurrentProduct,
} from "../../features/products/productSlice"
import { Loader } from "../../components/common/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "../../components/common/FormInput"
import { ArrowLeft } from "lucide-react"
import type { ProductFormData } from "../../types"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { currentProduct, loading, error } = useAppSelector((state) => state.products)

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    status: "in-stock",
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchProductById(id))
    } else {
      dispatch(clearCurrentProduct())
    }

    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id, isEditMode])

  useEffect(() => {
    if (currentProduct && isEditMode) {
      setFormData({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        category: currentProduct.category,
        stock: currentProduct.stock,
        status: currentProduct.status,
      })
    }
  }, [currentProduct, isEditMode])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required"
    }

    if (formData.price <= 0) {
      errors.price = "Price must be greater than 0"
    }

    if (formData.stock < 0) {
      errors.stock = "Stock cannot be negative"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) || 0 : value,
    }))

    // Clear error when field is edited
    if (formErrors[name as keyof ProductFormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (formErrors[name as keyof ProductFormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      if (isEditMode && id) {
        await dispatch(updateProduct({ id, productData: formData })).unwrap()
        setToastMessage("Product updated successfully")
      } else {
        await dispatch(createProduct(formData)).unwrap()
        setToastMessage("Product created successfully")
      }

      setToastType("success")
      setToastOpen(true)

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/products")
      }, 1500)
    } catch (error) {
      setToastMessage(typeof error === "string" ? error : "An error occurred")
      setToastType("error")
      setToastOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && isEditMode && !currentProduct) {
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
        <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? "Edit Product" : "Add Product"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update the details of your product" : "Fill in the details to add a new product"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Product Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                placeholder="Enter product name"
                required
              />

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category" className={formErrors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Toys">Toys</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Garden">Garden</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className={formErrors.description ? "border-destructive" : ""}
                rows={4}
              />
              {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Price ($)"
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price.toString()}
                onChange={handleChange}
                error={formErrors.price}
                placeholder="0.00"
                required
              />

              <FormInput
                label="Stock"
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock.toString()}
                onChange={handleChange}
                error={formErrors.stock}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={formData.status} onValueChange={(value: "in-stock" | "low-stock" | "out-of-stock") => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/products")} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ToastNotification message={toastMessage} type={toastType} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  )
}

export default ProductForm
