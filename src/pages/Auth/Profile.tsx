"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "../../components/common/FormInput"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getRoleColor } from "../../utils"
import { updateUser } from "../../features/users/userSlice"
import { getCurrentUser } from "../../features/auth/authSlice"

const Profile: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { loading, error } = useAppSelector((state) => state.users)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formErrors, setFormErrors] = useState<{
    name?: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")
  const [isPasswordSection, setIsPasswordSection] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const validateProfileForm = (): boolean => {
    const errors: { name?: string } = {}

    if (!name.trim()) {
      errors.name = "Name is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordForm = (): boolean => {
    const errors: {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!newPassword) {
      errors.newPassword = "New password is required"
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm() || !user) {
      return
    }

    try {
      await dispatch(
        updateUser({
          id: user.id,
          userData: {
            name,
            email: user.email, // Email can't be changed in this demo
            role: user.role,
            status: "active",
          },
        }),
      ).unwrap()

      // Refresh user data
      await dispatch(getCurrentUser()).unwrap()

      setToastMessage("Profile updated successfully")
      setToastType("success")
      setToastOpen(true)
    } catch (error) {
      setToastMessage(typeof error === "string" ? error : "An error occurred")
      setToastType("error")
      setToastOpen(true)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm() || !user) {
      return
    }

    // In a real app, you would send the current password for verification
    // For this demo, we'll just check if it's "password"
    if (currentPassword !== "password") {
      setFormErrors({
        ...formErrors,
        currentPassword: "Incorrect password",
      })
      return
    }

    try {
      // In a real app, you would update the password through an API
      // For this demo, we'll just show a success message
      setToastMessage("Password updated successfully")
      setToastType("success")
      setToastOpen(true)

      // Reset password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsPasswordSection(false)
    } catch (error) {
      setToastMessage(typeof error === "string" ? error : "An error occurred")
      setToastType("error")
      setToastOpen(true)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="text-muted-foreground">Manage your account settings and preferences</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account's profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge className={`mt-2 ${getRoleColor(user.role)}`}>{user.role}</Badge>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <FormInput
                label="Full Name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={formErrors.name}
                required
              />

              <FormInput
                label="Email"
                id="email"
                name="email"
                type="email"
                value={email}
                disabled
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            {!isPasswordSection ? (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure</p>
                  <Button onClick={() => setIsPasswordSection(true)}>Change Password</Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add additional security to your account</p>
                  <Button variant="outline" disabled>
                    Not Available in Demo
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <FormInput
                  label="Current Password"
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={formErrors.currentPassword}
                  required
                />

                <FormInput
                  label="New Password"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={formErrors.newPassword}
                  required
                />

                <FormInput
                  label="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={formErrors.confirmPassword}
                  required
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsPasswordSection(false)
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                      setFormErrors({})
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastNotification message={toastMessage} type={toastType} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  )
}

export default Profile
