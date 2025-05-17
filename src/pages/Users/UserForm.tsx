"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { createUser, fetchUserById, updateUser, clearCurrentUser } from "../../features/users/userSlice"
import { Loader } from "../../components/common/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "../../components/common/FormInput"
import { ArrowLeft } from "lucide-react"
import type { UserFormData } from "../../types"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isValidEmail } from "../../utils"

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { currentUser, loading, error } = useAppSelector((state) => state.users)
  const { user: authUser } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "viewer",
    password: "",
    status: "active",
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Only admin can access this page
    if (authUser?.role !== "admin") {
      navigate("/")
      return
    }

    if (isEditMode && id) {
      dispatch(fetchUserById(id))
    } else {
      dispatch(clearCurrentUser())
    }

    return () => {
      dispatch(clearCurrentUser())
    }
  }, [dispatch, id, isEditMode, navigate, authUser?.role])

  useEffect(() => {
    if (currentUser && isEditMode) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
        password: "", // Don't populate password in edit mode
      })
    }
  }, [currentUser, isEditMode])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof UserFormData, string>> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format"
    }

    if (!isEditMode && !formData.password) {
      errors.password = "Password is required for new users"
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (formErrors[name as keyof UserFormData]) {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      if (isEditMode && id) {
        // If editing yourself, don't allow role change to non-admin
        if (id === authUser?.id && formData.role !== "admin") {
          throw new Error("You can't change your own role from admin")
        }

        await dispatch(updateUser({ id, userData: formData })).unwrap()
        setToastMessage("User updated successfully")
      } else {
        await dispatch(createUser(formData)).unwrap()
        setToastMessage("User created successfully")
      }

      setToastType("success")
      setToastOpen(true)

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/users")
      }, 1500)
    } catch (error) {
      setToastMessage(typeof error === "string" ? error : "An error occurred")
      setToastType("error")
      setToastOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && isEditMode && !currentUser) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? "Edit User" : "Add User"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit User" : "Add New User"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update the details of your user" : "Fill in the details to add a new user"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                placeholder="Enter full name"
                required
              />

              <FormInput
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "editor" | "viewer") => handleSelectChange("role", value)}
                  disabled={isEditMode && currentUser?.id === authUser?.id}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {isEditMode && currentUser?.id === authUser?.id && (
                  <p className="text-xs text-muted-foreground">You cannot change your own role</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value as string)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isEditMode && (
              <FormInput
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                placeholder="Enter password"
                required={!isEditMode}
              />
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : isEditMode ? "Update User" : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ToastNotification open={toastOpen} message={toastMessage} type={toastType} onOpenChange={setToastOpen} />
    </div>
  )
}

export default UserForm
