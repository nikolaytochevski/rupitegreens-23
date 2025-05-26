"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Truck, Shield, Leaf } from "lucide-react"
import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { cn } from "@/lib/utils"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { products, addToCart, toggleFavorite, favorites } = useStore()
  const [quantity, setQuantity] = useState(1)

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const product = products.find((p) => p.id === Number.parseInt(params.id))
  const relatedProducts = products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Продуктът не е намерен</h1>
          <Link href="/products">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Обратно към продуктите
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isFavorite = favorites.includes(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products" className="text-green-600 hover:text-green-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm md:text-base">Обратно към продуктите</span>
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full rounded-lg shadow-lg"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">{product.badge}</Badge>
              )}
              {!product.inStock && <Badge className="absolute top-4 right-4 bg-red-600 text-white">Изчерпан</Badge>}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {product.category}
                </Badge>
                <span className="text-sm text-gray-500">{product.weight}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} отзива)
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-6">{product.price.toFixed(2)} лв</div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Количество:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? "Добави в количката" : "Изчерпан"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(product.id)}
                  className={cn("px-4", isFavorite && "text-red-500 border-red-200 bg-red-50")}
                >
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                </Button>
              </div>

              {product.inStock && product.stockQuantity <= 10 && (
                <p className="text-orange-600 text-sm">⚠️ Остават само {product.stockQuantity} бр. на склад</p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm font-medium">100% Натурално</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm font-medium">Бърза доставка</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs md:text-sm font-medium">Гарантия</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12 md:mb-16">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Съставки</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Информация за продукта</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Тегло:</span> {product.weight}
                    </div>
                    <div>
                      <span className="font-medium">Категория:</span> {product.category}
                    </div>
                    <div>
                      <span className="font-medium">Наличност:</span>{" "}
                      <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                        {product.inStock ? "В наличност" : "Изчерпан"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Рейтинг:</span> {product.rating}/5
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Подобни продукти</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
