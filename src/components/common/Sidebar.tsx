"use client"

import type React from "react"

import { Link} from "react-router-dom"
import { cn } from "@/lib/utils"
import { Package, Users, Settings, Home, ShoppingCart, ChevronDown, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector } from "../../store/hooks"
import { useState } from "react"

interface SidebarProps {
  open: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
//   const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)
  const [productsOpen, setProductsOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)

  const isAdmin = user?.role === "admin"
  const isEditor = user?.role === "editor" || isAdmin

//   const isActive = (path: string) => {
//     return location.pathname === path || location.pathname.startsWith(`${path}/`)
//   }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>ShopVerse Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="flex flex-col gap-2">
          <Link to="/">
            <Button variant={"default"} className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Collapsible open={productsOpen} onOpenChange={setProductsOpen} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button variant={"default"} className="w-full justify-start gap-2">
                <ShoppingCart className="h-4 w-4" />
                Products
                {productsOpen ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              <Link to="/products">
                <Button
                  variant={"default"}
                  className="w-full justify-start text-sm"
                >
                  All Products
                </Button>
              </Link>
              {isEditor && (
                <Link to="/products/new">
                  <Button
                    variant={"default"}
                    className="w-full justify-start text-sm"
                  >
                    Add Product
                  </Button>
                </Link>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen} className="space-y-1">
            <CollapsibleTrigger asChild>
              <Button variant={"default"} className="w-full justify-start gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
                {ordersOpen ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              <Link to="/orders">
                <Button
                  variant={"default"}
                  className="w-full justify-start text-sm"
                >
                  All Orders
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {isAdmin && (
            <Collapsible open={usersOpen} onOpenChange={setUsersOpen} className="space-y-1">
              <CollapsibleTrigger asChild>
                <Button variant={"default"} className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Users
                  {usersOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-6">
                <Link to="/users">
                  <Button
                    variant={"default"}
                    className="w-full justify-start text-sm"
                  >
                    All Users
                  </Button>
                </Link>
                <Link to="/users/new">
                  <Button variant={"default"} className="w-full justify-start text-sm">
                    Add User
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Link to="/profile">
            <Button variant={"default"} className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </Button>
          </Link>
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
