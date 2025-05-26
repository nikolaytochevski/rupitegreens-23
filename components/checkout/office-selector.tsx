"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Clock, Phone } from "lucide-react"
import type { EcontOffice } from "@/lib/econt-api"

interface OfficeSelectorProps {
  cityId: number
  selectedOffice: EcontOffice | null
  onOfficeSelect: (office: EcontOffice) => void
}

export function OfficeSelector({ cityId, selectedOffice, onOfficeSelect }: OfficeSelectorProps) {
  const [offices, setOffices] = useState<EcontOffice[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (cityId) {
      loadOffices()
    }
  }, [cityId])

  const loadOffices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/econt/offices?cityId=${cityId}`)
      const data = await response.json()
      const officeList = data.offices || []
      setOffices(officeList)

      // Auto-select first office if none selected
      if (officeList.length > 0 && !selectedOffice) {
        onOfficeSelect(officeList[0])
      }
    } catch (error) {
      console.error("Failed to load offices:", error)
      setOffices([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatWorkingHours = (from: number, to: number): string => {
    if (!from || !to) return "Не работи"

    // Handle 24/7 automats
    if (from === 0 && to === 86400000) return "24/7"

    const fromDate = new Date(from)
    const toDate = new Date(to)

    return `${fromDate.getHours().toString().padStart(2, "0")}:${fromDate.getMinutes().toString().padStart(2, "0")} - ${toDate.getHours().toString().padStart(2, "0")}:${toDate.getMinutes().toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Зареждане на офиси...</span>
      </div>
    )
  }

  if (offices.length === 0) {
    return (
      <div className="text-center p-8">
        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Няма налични офиси в този град</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-gray-900">Изберете офис ({offices.length} налични)</h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {offices.map((office) => (
          <button
            key={office.id}
            onClick={() => onOfficeSelect(office)}
            className={`w-full text-left p-4 border rounded-lg transition-all ${
              selectedOffice?.id === office.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{office.name}</h4>
                {office.isAPS && (
                  <Badge variant="secondary" className="text-xs">
                    Автомат 24/7
                  </Badge>
                )}
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-relaxed">{office.address.fullAddress}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {formatWorkingHours(office.normalBusinessHoursFrom, office.normalBusinessHoursTo)}
                </span>
              </div>

              {office.phones.length > 0 && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{office.phones[0]}</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
