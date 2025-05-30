import type React from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-6">
          <Link to="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
