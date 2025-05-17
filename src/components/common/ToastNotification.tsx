"use client"

import type React from "react"

import { toast } from "sonner"
import { useEffect } from "react"

interface ToastNotificationProps {
  message: string
  type: "success" | "error" | "warning" | "info"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, open, onOpenChange }) => {

  useEffect(() => {
    if (open && message) {
      toast(
        message,
        {
          className:
            type === "error"
              ? "bg-red-500 text-white"
              : type === "success"
              ? "bg-green-500 text-white"
              : type === "warning"
              ? "bg-yellow-400 text-black"
              : "bg-blue-500 text-white",
        }
      )
      onOpenChange(false)
    }
  }, [open, message, type, toast, onOpenChange])

  return null
}
