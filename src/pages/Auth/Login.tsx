"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { login, clearError } from "../../features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "../../components/common/FormInput"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Package } from "lucide-react"

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const [toastOpen, setToastOpen] = useState(false)

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      errors.email = "Email is required"
    }

    if (!password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await dispatch(login({ email, password })).unwrap()
      navigate("/")
    } catch {
      // Error is handled by the auth slice
      setToastOpen(true)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span className="text-xl">ShopVerse Admin</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
            required
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          For demo purposes, use: admin@example.com / password
        </div>
      </CardFooter>

      <ToastNotification
        message={error || ""}
        type="error"
        open={toastOpen}
        onOpenChange={(open) => {
          setToastOpen(open)
          if (!open) dispatch(clearError())
        }}
      />
    </Card>
  )
}

export default Login
