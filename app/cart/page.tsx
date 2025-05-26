"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"

export default function CartPage() {
  const { cart, getCartItemsCount, getCartTotal, updateCartQuantity, removeFromCart, clearCart } = useStore()

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cartItemsCount = getCartItemsCount()
  const cartTotal = getCartTotal()
  const deliveryFee = cartTotal >= 50 ? 0 : 5.99
  const finalTotal = cartTotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto max-w-md px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Количката ви е празна</h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Изглежда още не сте добавили продукти в количката си.
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Продължи пазаруването
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link href="/products" className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm md:text-base">Продължи пазаруването</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Количка за пазаруване</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">{cartItemsCount} продукта в количката</p>
            </div>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50 w-full md:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Изчисти количката
            </Button>
          </div>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image and Info */}
                    <div className="flex gap-4 flex-1">
                      <Link href={`/products/${item.id}`} className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </Link>

                      <div className="flex-1 space-y-2">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-semibold text-base md:text-lg hover:text-green-600 transition-colors cursor-pointer line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500">
                          {item.category} • {item.weight}
                        </p>
                        <p className="text-green-600 font-semibold text-lg">{item.price.toFixed(2)} лв</p>
                      </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 order-2 sm:order-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16 text-center h-8"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Total Price and Remove */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 order-1 sm:order-2">
                        <div className="text-right">
                          <p className="font-semibold text-lg">{(item.price * item.quantity).toFixed(2)} лв</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Обобщение на поръчката</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Продукти ({cartItemsCount})</span>
                    <span>{cartTotal.toFixed(2)} лв</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "Безплатна" : `${deliveryFee.toFixed(2)} лв`}
                    </span>
                  </div>
                  {cartTotal < 50 && (
                    <p className="text-sm text-orange-600">
                      Добавете още {(50 - cartTotal).toFixed(2)} лв за безплатна доставка
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Общо</span>
                  <span className="text-green-600">{finalTotal.toFixed(2)} лв</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                    Към поръчката
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <div className="text-center text-sm text-gray-500 space-y-1">
                  <p>✓ Сигурно плащане</p>
                  <p>✓ 30 дни гаранция за връщане</p>
                  <p>✓ Безплатна доставка над 50 лв</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Order Summary - Fixed Bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
          <div className="container mx-auto max-w-md">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{cartItemsCount} продукта</p>
                  <p className="text-lg font-semibold text-green-600">{finalTotal.toFixed(2)} лв</p>
                </div>
                <Link href="/checkout">
                  <Button className="bg-green-600 hover:bg-green-700 px-6">
                    Към поръчката
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              {cartTotal < 50 && (
                <p className="text-xs text-center text-orange-600">
                  Добавете още {(50 - cartTotal).toFixed(2)} лв за безплатна доставка
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Spacer */}
        <div className="lg:hidden h-24"></div>
      </div>
    </div>
  )
}
