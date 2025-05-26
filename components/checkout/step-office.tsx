"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react"
import { ComboboxCity } from "@/components/checkout/combobox-city"
import { OfficeSelector } from "@/components/checkout/office-selector"
import { useStore } from "@/lib/store"
import type { EcontCity, EcontOffice } from "@/lib/econt-api"

interface StepOfficeProps {
  onComplete: () => void
  onBack: () => void
}

export function StepOffice({ onComplete, onBack }: StepOfficeProps) {
  const { setDeliveryInfo } = useStore()
  const [selectedCity, setSelectedCity] = useState<EcontCity | null>(null)
  const [selectedOffice, setSelectedOffice] = useState<EcontOffice | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleComplete = async () => {
    if (!selectedCity || !selectedOffice) return

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
          mode: selectedOffice.isAPS ? "aps" : "office",
          shipmentType: "PACK",
        }),
      })

      const calculation = await response.json()

      // Save delivery info
      setDeliveryInfo({
        method: "office",
        price: calculation.totalPrice || 5.99,
        city: selectedCity,
        office: selectedOffice,
        deadline: calculation.deliveryDeadline || 2,
      })

      onComplete()
    } catch (error) {
      console.error("Failed to calculate shipping:", error)
      // Use fallback pricing
      setDeliveryInfo({
        method: "office",
        price: 5.99,
        city: selectedCity,
        office: selectedOffice,
        deadline: 2,
      })
      onComplete()
    } finally {
      setIsCalculating(false)
    }
  }

  const isValid = selectedCity && selectedOffice

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Избор на офис</h2>
        <p className="text-gray-600">Изберете офис или автомат на Еконт за получаване</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <ComboboxCity selectedCity={selectedCity} onCitySelect={setSelectedCity} placeholder="Изберете град..." />
        </div>

        {selectedCity && (
          <div className="space-y-2">
            <OfficeSelector
              cityId={selectedCity.id}
              selectedOffice={selectedOffice}
              onOfficeSelect={setSelectedOffice}
            />
          </div>
        )}
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
