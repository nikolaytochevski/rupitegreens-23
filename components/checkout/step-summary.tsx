"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Home, Edit, CreditCard, Banknote, Clock, Package, CheckCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface StepSummaryProps {
  deliveryMethod: "door" | "office"
  onEditDelivery: () => void
}

export function StepSummary({ deliveryMethod, onEditDelivery }: StepSummaryProps) {
  const { cart, getCartTotal, getCartItemsCount, deliveryInfo, clearCart } = useStore()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)

  const cartTotal = getCartTotal()
  const cartItemsCount = getCartItemsCount()
  const deliveryFee = deliveryInfo?.price || 0
  const finalTotal = cartTotal + deliveryFee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      toast({
        title: "Грешка",
        description: "Моля, приемете общите условия за да продължите.",
        variant: "destructive",
      })
      return
    }

    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: "Грешка",
        description: "Моля, попълнете всички задължителни полета.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      clearCart()
      toast({
        title: "Поръчката е изпратена успешно!",
        description: "Ще получите потвърждение на имейла си в рамките на няколко минути.",
        duration: 5000,
      })
      setIsProcessing(false)
      window.location.href = "/order-success"
    }, 2000)
  }

  const isFormValid =
    contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone && termsAccepted

  return (
    <form onSubmit={handleSubmitOrder} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Обобщение на поръчката</h2>
        <p className="text-gray-600">Прегледайте детайлите преди потвърждаване</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Контактна информация</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Име *</Label>
                  <Input
                    id="firstName"
                    value={contactInfo.firstName}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Вашето име"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={contactInfo.lastName}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Вашата фамилия"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Имейл *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+359 888 123 456"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Доставка</h3>
                <Button type="button" variant="outline" size="sm" onClick={onEditDelivery}>
                  <Edit className="w-4 h-4 mr-1" />
                  Редактирай
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {deliveryMethod === "door" ? (
                    <Home className="w-5 h-5 text-green-600" />
                  ) : (
                    <MapPin className="w-5 h-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {deliveryMethod === "door" ? "Доставка до адрес" : "Доставка до офис"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {deliveryInfo?.city?.name}, {deliveryInfo?.city?.regionName}
                    </p>
                  </div>
                </div>

                {deliveryMethod === "office" && deliveryInfo?.office && (
                  <div className="pl-8 text-xs text-gray-600">
                    <p className="font-medium">{deliveryInfo.office.name}</p>
                    <p>{deliveryInfo.office.address.fullAddress}</p>
                  </div>
                )}

                {deliveryMethod === "door" && deliveryInfo?.address && (
                  <div className="pl-8 text-xs text-gray-600">
                    <p>{deliveryInfo.address.street}</p>
                    {deliveryInfo.address.quarter && <p>кв. {deliveryInfo.address.quarter}</p>}
                  </div>
                )}

                <div className="flex items-center gap-2 pl-8 text-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Срок: {deliveryInfo?.deadline || 2} работни дни</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Начин на плащане</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">Банкова карта</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, Maestro</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">Наложен платеж</p>
                      <p className="text-xs text-gray-500">Плащане при доставка</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Cart Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Вашата поръчка ({cartItemsCount} продукта)</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Количество: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} лв</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Totals */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Обобщение</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Продукти ({cartItemsCount})</span>
                  <span>{cartTotal.toFixed(2)} лв</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Доставка</span>
                  <span>{deliveryFee.toFixed(2)} лв</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Общо за плащане</span>
                  <span className="text-green-600">{finalTotal.toFixed(2)} лв</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} />
                <Label htmlFor="terms" className="text-sm">
                  Съгласен съм с общите условия и политиката за поверителност
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                {isProcessing ? (
                  <>
                    <Package className="w-4 h-4 mr-2 animate-pulse" />
                    Обработва се...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Потвърди поръчката
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>🔒 Сигурно SSL криптиране</p>
                <p>📞 Поддръжка: +359 888 123 456</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
