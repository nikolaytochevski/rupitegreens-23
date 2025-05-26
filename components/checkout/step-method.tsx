"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, MapPin, Truck, Clock } from "lucide-react"

interface StepMethodProps {
  onMethodSelect: (method: "door" | "office") => void
}

export function StepMethod({ onMethodSelect }: StepMethodProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Изберете начин на доставка</h2>
        <p className="text-gray-600">Как искате да получите поръчката си?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Door Delivery */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-300"
          onClick={() => onMethodSelect("door")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Доставка до адрес</h3>
              <p className="text-sm text-gray-600 mb-4">Куриерът ще достави директно до вашия адрес</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>1-3 работни дни</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>От 8.99 лв</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">Избери доставка до адрес</Button>
          </CardContent>
        </Card>

        {/* Office Delivery */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-300"
          onClick={() => onMethodSelect("office")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Доставка до офис</h3>
              <p className="text-sm text-gray-600 mb-4">Вземете от офис или автомат на Еконт</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>1-2 работни дни</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>От 5.99 лв</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              Избери доставка до офис
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>💡 Съвет: Доставката до офис обикновено е по-бърза и по-евтина</p>
      </div>
    </div>
  )
}
