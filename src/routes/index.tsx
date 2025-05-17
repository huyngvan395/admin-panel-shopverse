import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"

// Layouts
import MainLayout from "../components/layouts/MainLayout"
import AuthLayout from "../components/layouts/AuthLayout"

// Pages
import Dashboard from "../pages/Dashboard"
import NotFound from "../pages/NotFound"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import Profile from "../pages/Auth/Profile"

// Lazy loaded pages for better performance
const ProductList = lazy(() => import("../pages/Products/ProductList"))
const ProductDetail = lazy(() => import("../pages/Products/ProductDetail"))
const ProductForm = lazy(() => import("../pages/Products/ProductForm"))
const UserList = lazy(() => import("../pages/Users/UserList"))
const UserDetail = lazy(() => import("../pages/Users/UserDetail"))
const UserForm = lazy(() => import("../pages/Users/UserForm"))
const OrderList = lazy(() => import("../pages/Orders/OrderList"))
const OrderDetail = lazy(() => import("../pages/Orders/OrderDetail"))

// Protected route component
import ProtectedRoute from "./ProtectedRoute"
import { Loader } from "../components/common/Loader"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <ProductList />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<Loader />}>
                <ProductDetail />
              </Suspense>
            ),
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<Loader />}>
                <ProductForm />
              </Suspense>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <ProductForm />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <OrderList />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<Loader />}>
                <OrderDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader />}>
                <UserList />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<Loader />}>
                <UserDetail />
              </Suspense>
            ),
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<Loader />}>
                <UserForm />
              </Suspense>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <UserForm />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default router
