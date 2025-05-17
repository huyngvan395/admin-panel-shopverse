"use client"

import type React from "react"

import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { getCurrentUser } from "../features/auth/authSlice"
import { Loader } from "../components/common/Loader"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "editor" | "viewer"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, loading])

  // Show loader while checking authentication
  if (loading) {
    return <Loader />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Check for required role if specified
  if (requiredRole && user && user.role !== requiredRole) {
    // If user doesn't have the required role, redirect to dashboard
    return <Navigate to="/" replace />
  }

  // If authenticated and has required role (if any), render children
  return <>{children}</>
}

export default ProtectedRoute
