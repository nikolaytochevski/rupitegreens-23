"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import { ComboboxCity } from "@/components/checkout/combobox-city"
import { useStore } from "@/lib/store"
import type { EcontCity } from "@/lib/econt-api"

interface StepAddressProps {
  onComplete: () => void
  onBack: () => void
}

export function StepAddress({ onComplete, onBack }: StepAddressProps) {
  const { setDeliveryInfo } = useStore()
  const [selectedCity, setSelectedCity] = useState<EcontCity | null>(null)
  const [address, setAddress] = useState("")
  const [quarter, setQuarter] = useState("")
  const [notes, setNotes] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  const handleComplete = async () => {
    if (!selectedCity || !address.trim()) return

    setIsCalculating(true)

    try {
      // Calculate shipping cost
      const response = await fetch("/api/econt/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderCityId: 1, // София
          receiverCityId: selectedCity.id,
          weight: 1, // Default weight
          mode: "door",
          shipmentType: "PACK",
        }),
      })

      const calculation = await response.json()

      // Save delivery info
      setDeliveryInfo({
        method: "door",
        price: calculation.totalPrice || 8.99,
        city: selectedCity,
        deadline: calculation.deliveryDeadline || 2,
        address: {
          street: address,
          quarter,
          notes,
        },
      })

      onComplete()
    } catch (error) {
      console.error("Failed to calculate shipping:", error)
      // Use fallback pricing
      setDeliveryInfo({
        method: "door",
        price: 8.99,
        city: selectedCity,
        deadline: 2,
        address: {
          street: address,
          quarter,
          notes,
        },
      })
      onComplete()
    } finally {
      setIsCalculating(false)
    }
  }

  const isValid = selectedCity && address.trim()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Адрес за доставка</h2>
        <p className="text-gray-600">Въведете адреса, където искате да получите поръчката</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            Град *
          </Label>
          <ComboboxCity selectedCity={selectedCity} onCitySelect={setSelectedCity} placeholder="Изберете град..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Адрес *
          </Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ул. Примерна 123, ет. 2, ап. 5"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quarter" className="text-sm font-medium">
            Квартал (по избор)
          </Label>
          <Input
            id="quarter"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            placeholder="кв. Лозенец"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Забележки за куриера (по избор)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Допълнителни инструкции за доставката..."
            className="text-sm min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={onBack} className="order-2 sm:order-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!isValid || isCalculating}
          className="bg-green-600 hover:bg-green-700 order-1 sm:order-2"
        >
          {isCalculating ? "Изчисляване..." : "Продължи"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
