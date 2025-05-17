import type React from "react"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", fullScreen = false }) => {
  const sizeClass = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }[size]

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader2 className={`${sizeClass} animate-spin text-primary`} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClass} animate-spin text-primary`} />
    </div>
  )
}
