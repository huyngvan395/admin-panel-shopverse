"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { deleteUser, fetchUsers } from "../../features/users/userSlice"
import { Loader } from "../../components/common/Loader"
import { UserTable } from "../../components/user/UserTable"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Modal } from "../../components/common/Modal"
import { ToastNotification } from "../../components/common/ToastNotification"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const UserList: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { users, loading, error } = useAppSelector((state) => state.users)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success")

  useEffect(() => {
    // Only admin can access this page
    if (currentUser?.role !== "admin") {
      navigate("/")
      return
    }

    dispatch(fetchUsers())
  }, [dispatch, navigate, currentUser?.role])

  useEffect(() => {
    if (error) {
      setToastMessage(error)
      setToastType("error")
      setToastOpen(true)
    }
  }, [error])

  const handleDeleteClick = (id: string) => {
    // Prevent deleting yourself
    if (id === currentUser?.id) {
      setToastMessage("You can't delete your own account")
      setToastType("warning")
      setToastOpen(true)
      return
    }

    setUserToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete)).unwrap()
        setToastMessage("User deleted successfully")
        setToastType("success")
        setToastOpen(true)
      } catch{
        setToastMessage("Failed to delete user")
        setToastType("error")
        setToastOpen(true)
      }
      setDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading && users.length === 0) {
    return <Loader />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your users and their permissions</p>
        </div>
        <Link to="/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium">No users found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <UserTable users={filteredUsers} onDelete={handleDeleteClick} />
      )}

      <Modal
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ToastNotification message={toastMessage} type={toastType} open={toastOpen} onOpenChange={setToastOpen} />
    </div>
  )
}

export default UserList
