import type React from "react"
import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <Outlet />
      </div>
      <Toaster />
    </div>
  )
}

export default AuthLayout
