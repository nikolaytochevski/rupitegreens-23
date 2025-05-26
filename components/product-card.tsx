"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useStore, type Product } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const isFavorite = favorites.includes(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    addToCart(product)

    toast({
      title: "Добавено в количката!",
      description: `${product.name} беше добавен в количката ви.`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {product.badge && <Badge className="absolute top-3 left-3 bg-green-600">{product.badge}</Badge>}
            {!product.inStock && <Badge className="absolute top-3 right-3 bg-red-600">Изчерпан</Badge>}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                "absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white",
                isFavorite && "text-red-500",
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-xs text-gray-400">{product.weight}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({product.reviews})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">{product.price.toFixed(2)} лв</span>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className="bg-green-600 hover:bg-green-700 text-xs px-3 disabled:opacity-50"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {isAdding ? "Добавя..." : product.inStock ? "Добави" : "Изчерпан"}
              </Button>
            </div>

            {product.inStock && product.stockQuantity <= 10 && (
              <p className="text-xs text-orange-600">Остават само {product.stockQuantity} бр.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
