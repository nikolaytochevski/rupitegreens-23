"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Clock, Package, Truck, Search } from "lucide-react"
import { econtAPI, type EcontCity, type EcontOffice, type EcontCalculateResponse } from "@/lib/econt-api"

interface DeliveryCalculatorProps {
  cartWeight: number
  cartValue: number
  onDeliveryChange: (
    delivery: { method: string; price: number; office?: EcontOffice; city?: EcontCity; deadline: number } | null,
  ) => void
}

export function DeliveryCalculator({ cartWeight, cartValue, onDeliveryChange }: DeliveryCalculatorProps) {
  const [cities, setCities] = useState<EcontCity[]>([])
  const [offices, setOffices] = useState<EcontOffice[]>([])
  const [selectedCity, setSelectedCity] = useState<EcontCity | null>(null)
  const [selectedOffice, setSelectedOffice] = useState<EcontOffice | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<"office" | "door" | "aps">("office")
  const [citySearch, setCitySearch] = useState("")
  const [showCityResults, setShowCityResults] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingOffices, setIsLoadingOffices] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculation, setCalculation] = useState<EcontCalculateResponse | null>(null)

  // Load initial cities for Bulgaria
  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    if (selectedCity && (deliveryMethod === "office" || deliveryMethod === "aps")) {
      loadOffices(selectedCity.id)
    } else {
      setOffices([])
      setSelectedOffice(null)
    }
  }, [selectedCity, deliveryMethod])

  useEffect(() => {
    if (selectedCity && (deliveryMethod === "door" || selectedOffice)) {
      calculateShipping()
    } else {
      setCalculation(null)
      onDeliveryChange(null)
    }
  }, [selectedCity, selectedOffice, deliveryMethod, cartWeight])

  const loadCities = async (search?: string) => {
    setIsLoadingCities(true)
    try {
      // Load cities from Bulgaria (BGR)
      const citiesData = await econtAPI.getCities("BGR", search)
      setCities(citiesData)
    } catch (error) {
      console.error("Failed to load cities:", error)
    } finally {
      setIsLoadingCities(false)
    }
  }

  const loadOffices = async (cityId: number) => {
    setIsLoadingOffices(true)
    try {
      const officesData = await econtAPI.getOffices(cityId)
      const filteredOffices = officesData.filter((office) => {
        if (deliveryMethod === "aps") return office.isAPS
        if (deliveryMethod === "office") return office.isOffice
        return true
      })

      setOffices(filteredOffices)

      if (filteredOffices.length > 0) {
        setSelectedOffice(filteredOffices[0])
      } else {
        setSelectedOffice(null)
      }
    } catch (error) {
      console.error("Failed to load offices:", error)
      setOffices([])
      setSelectedOffice(null)
    } finally {
      setIsLoadingOffices(false)
    }
  }

  const calculateShipping = async () => {
    if (!selectedCity) return

    setIsCalculating(true)
    try {
      // Use Sofia (ID: 1) as sender city - можете да промените според вашето местоположение
      const calculationData = await econtAPI.calculateShipping({
        senderCityId: 1, // София като изпращач
        receiverCityId: selectedCity.id,
        weight: Math.max(cartWeight, 0.5), // Минимум 0.5кг
        shipmentType: "PACK",
        mode: deliveryMethod,
        declaredValue: cartValue,
      })

      setCalculation(calculationData)

      onDeliveryChange({
        method: deliveryMethod,
        price: calculationData.totalPrice,
        office: selectedOffice || undefined,
        city: selectedCity,
        deadline: calculationData.deliveryDeadline,
      })
    } catch (error) {
      console.error("Failed to calculate shipping:", error)
      onDeliveryChange(null)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleCitySearch = async (value: string) => {
    setCitySearch(value)
    if (value.length >= 2) {
      setShowCityResults(true)
      await loadCities(value)
    } else {
      setShowCityResults(false)
      if (value.length === 0) {
        await loadCities() // Load all cities when search is cleared
      }
    }
  }

  const handleCitySelect = (city: EcontCity) => {
    setSelectedCity(city)
    setCitySearch(city.name)
    setShowCityResults(false)
    setSelectedOffice(null)
  }

  const handleDeliveryMethodChange = (method: "office" | "door" | "aps") => {
    setDeliveryMethod(method)
    setSelectedOffice(null)
  }

  const handleSearchCities = () => {
    if (citySearch.length >= 2) {
      loadCities(citySearch)
      setShowCityResults(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Truck className="w-5 h-5" />
          Доставка с Еконт
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm md:text-base">
            Град за доставка *
          </Label>
          <div className="flex gap-2">
            <Input
              id="city"
              placeholder="Въведете град..."
              value={citySearch}
              onChange={(e) => handleCitySearch(e.target.value)}
              onFocus={() => citySearch.length >= 2 && setShowCityResults(true)}
              className="text-sm md:text-base"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSearchCities}
              disabled={isLoadingCities || citySearch.length < 2}
              className="px-3"
            >
              {isLoadingCities ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {showCityResults && cities.length > 0 && (
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-sm md:text-base">{city.name}</div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {city.regionName} • {city.postCode}
                    {city.expressCityDeliveries && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Експресна доставка
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showCityResults && cities.length === 0 && !isLoadingCities && citySearch.length >= 2 && (
            <p className="text-xs md:text-sm text-gray-500 p-3 border rounded-lg">
              Няма намерени градове за "{citySearch}"
            </p>
          )}
        </div>

        {selectedCity && (
          <div className="space-y-3 md:space-y-4">
            <Label className="text-sm md:text-base">Начин на доставка *</Label>
            <RadioGroup
              value={deliveryMethod}
              onValueChange={handleDeliveryMethodChange}
              className="space-y-2 md:space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg">
                <RadioGroupItem value="office" id="office" />
                <Label htmlFor="office" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium text-sm md:text-base">До офис на Еконт</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">Вземете от най-близкия офис</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg">
                <RadioGroupItem value="aps" id="aps" />
                <Label htmlFor="aps" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="font-medium text-sm md:text-base">До автомат</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">24/7 достъп до автомат</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 md:p-4 border rounded-lg">
                <RadioGroupItem value="door" id="door" />
                <Label htmlFor="door" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium text-sm md:text-base">До адрес</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">Доставка до вашия адрес</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {selectedCity && (deliveryMethod === "office" || deliveryMethod === "aps") && (
          <div className="space-y-2">
            <Label className="text-sm md:text-base">Изберете {deliveryMethod === "aps" ? "автомат" : "офис"} *</Label>
            {isLoadingOffices ? (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm md:text-base">
                  Зареждане на {deliveryMethod === "aps" ? "автомати" : "офиси"}...
                </span>
              </div>
            ) : offices.length > 0 ? (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {offices.map((office) => (
                  <button
                    key={office.id}
                    type="button"
                    onClick={() => setSelectedOffice(office)}
                    className={`w-full text-left p-3 border-b last:border-b-0 transition-colors ${
                      selectedOffice?.id === office.id ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base truncate">{office.name}</div>
                        <div className="text-xs md:text-sm text-gray-500 truncate">{office.address}</div>
                        <div className="text-xs text-gray-400">
                          {office.workingTimeFrom} - {office.workingTimeTo}
                          {office.phone && ` • ${office.phone}`}
                        </div>
                      </div>
                      {office.isAPS && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          24/7
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-500 p-3 border rounded-lg">
                Няма налични {deliveryMethod === "aps" ? "автомати" : "офиси"} в {selectedCity.name}
              </p>
            )}
          </div>
        )}

        {selectedCity && (
          <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm md:text-base">Изчисляване на цената...</span>
              </div>
            ) : calculation ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm md:text-base">Цена за доставка:</span>
                  <span className="text-lg font-bold text-green-600">{calculation.totalPrice.toFixed(2)} лв</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Срок на доставка: {calculation.deliveryDeadline} работни дни</span>
                  {selectedCity.expressCityDeliveries && (
                    <Badge variant="secondary" className="text-xs">
                      Експресна
                    </Badge>
                  )}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  <strong>Доставка до:</strong> {selectedCity.name}, {selectedCity.regionName}
                </div>
                {selectedOffice && (
                  <div className="text-xs md:text-sm text-gray-600">
                    <strong>{selectedOffice.isAPS ? "Автомат" : "Офис"}:</strong> {selectedOffice.name}
                    <br />
                    <span className="truncate block">{selectedOffice.address}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-500">
                {!selectedCity
                  ? "Изберете град за изчисляване на доставката"
                  : deliveryMethod !== "door" && !selectedOffice
                    ? `Изберете ${deliveryMethod === "aps" ? "автомат" : "офис"} за изчисляване`
                    : "Изчисляване..."}
              </p>
            )}
          </div>
        )}

        {/* API Status Info */}
        <div className="text-xs text-gray-400 text-center">Използва реален Econt API за градове и офиси</div>
      </CardContent>
    </Card>
  )
}
