"use client"

import type React from "react"

import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { deleteUser, fetchUserById } from "../../features/users/userSlice"
import { Loader } from "../../components/common/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { formatDate, getStatusColor, getRoleColor } from "../../utils"
import { useState } from "react"
import { Modal } from "../../components/common/Modal"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentUser, loading, error } = useAppSelector((state) => state.users)
  const { user: authUser } = useAppSelector((state) => state.auth)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")

  useEffect(() => {
    // Only admin can access this page
    if (authUser?.role !== "admin") {
      navigate("/")
      return
    }

    if (id) {
      dispatch(fetchUserById(id))
    }
  }, [dispatch, id, navigate, authUser?.role])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const handleDelete = async () => {
    if (id) {
      // Prevent deleting yourself
      if (id === authUser?.id) {
        setToastMessage("You can't delete your own account")
        setToastType("warning")
        setToastOpen(true)
        setDeleteModalOpen(false)
        return
      }

      try {
        await dispatch(deleteUser(id)).unwrap()
        setToastMessage("User deleted successfully")
        setToastType("success")
        setToastOpen(true)
        setTimeout(() => {
          navigate("/users")
        }, 1500)
      } catch{
        setToastMessage("Failed to delete user")
        setToastType("error")
        setToastOpen(true)
      }
      setDeleteModalOpen(false)
    }
  }

  if (loading || !currentUser) {
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
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>View detailed information about this user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Name</span>
              <span className="font-medium">{currentUser.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span>{currentUser.email}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Role</span>
                <Badge className={getRoleColor(currentUser.role)}>{currentUser.role}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge className={getStatusColor(currentUser.status)}>{currentUser.status}</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Created</span>
              <span>{formatDate(currentUser.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button className="flex-1" asChild>
                <Link to={`/users/edit/${currentUser.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit User
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setDeleteModalOpen(true)}
                disabled={currentUser.id === authUser?.id}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
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

export default UserDetail
