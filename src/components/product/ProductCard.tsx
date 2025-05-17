"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "../../types"
import { formatCurrency, getStatusColor, truncateText } from "../../utils"
import { Edit, Eye, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../store/hooks"

interface ProductCardProps {
  product: Product
  onDelete: (id: string) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const { user } = useAppSelector((state) => state.auth)
  const isEditor = user?.role === "admin" || user?.role === "editor"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={product.image || "/placeholder.svg?height=192&width=384"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className={`absolute right-2 top-2 ${getStatusColor(product.status)}`}>{product.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{truncateText(product.description, 100)}</p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span>Stock: {product.stock}</span>
          <span>Category: {product.category}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Link to={`/products/${product.id}`} className="flex-1">
          <Button variant="default" className="w-full gap-1">
            <Eye className="h-4 w-4" /> View
          </Button>
        </Link>
        {isEditor && (
          <>
            <Link to={`/products/edit/${product.id}`} className="flex-1">
              <Button variant="default" className="w-full gap-1">
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </Link>
            <Button variant="destructive" size="icon" onClick={() => onDelete(product.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
