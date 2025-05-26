"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"

export function CartSidebar() {
  const {
    cart,
    getCartItemsCount,
    getCartTotal,
    getDeliveryFee,
    getFinalTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const cartItemsCount = getCartItemsCount()
  const cartTotal = getCartTotal()
  const deliveryFee = getDeliveryFee()
  const finalTotal = getFinalTotal()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4" />
          {cartItemsCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-green-600 text-xs">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Количка за пазаруване
            {cart.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Изчисти
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex-1">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Количката ви е празна</p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setIsOpen(false)}>
                Продължи пазаруването
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}>
                        <h4 className="font-medium text-sm truncate hover:text-green-600 transition-colors cursor-pointer">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-green-600 font-semibold">{item.price.toFixed(2)} лв</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Продукти:</span>
                    <span>{cartTotal.toFixed(2)} лв</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Доставка:</span>
                      <span>{deliveryFee.toFixed(2)} лв</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                    <span>Общо:</span>
                    <span className="text-green-600">{finalTotal.toFixed(2)} лв</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Към количката</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Продължи пазаруването
                  </Button>
                </div>

                {!deliveryFee && cartTotal < 50 && (
                  <p className="text-xs text-center text-orange-600">
                    Добавете още {(50 - cartTotal).toFixed(2)} лв за безплатна доставка
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
