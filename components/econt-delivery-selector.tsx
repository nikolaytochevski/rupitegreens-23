"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, MapPin, Clock, Search, Calendar } from "lucide-react"
import { econtAPI, type EcontCity, type EcontOffice, type EcontCalculateResponse } from "@/lib/econt-api"

interface EcontDeliverySelectorProps {
  cartWeight: number
  cartValue: number
  onDeliveryChange: (
    delivery: {
      method: string
      price: number
      office: EcontOffice
      city: EcontCity
      deadline: number
      saturdayDelivery?: boolean
    } | null,
  ) => void
}

export function EcontDeliverySelector({ cartWeight, cartValue, onDeliveryChange }: EcontDeliverySelectorProps) {
  const [cities, setCities] = useState<EcontCity[]>([])
  const [offices, setOffices] = useState<EcontOffice[]>([])
  const [selectedCity, setSelectedCity] = useState<EcontCity | null>(null)
  const [selectedOffice, setSelectedOffice] = useState<EcontOffice | null>(null)
  const [citySearch, setCitySearch] = useState("")
  const [showCityResults, setShowCityResults] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingOffices, setIsLoadingOffices] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculation, setCalculation] = useState<EcontCalculateResponse | null>(null)
  const [saturdayDelivery, setSaturdayDelivery] = useState(false)
  const [saturdayAvailable, setSaturdayAvailable] = useState(false)

  // Load initial cities for Bulgaria
  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    if (selectedCity) {
      loadOffices(selectedCity.id)
      checkSaturdayAvailability(selectedCity.id)
    } else {
      setOffices([])
      setSelectedOffice(null)
      setSaturdayAvailable(false)
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedCity && selectedOffice) {
      calculateShipping()
    } else {
      setCalculation(null)
      onDeliveryChange(null)
    }
  }, [selectedCity, selectedOffice, cartWeight, saturdayDelivery])

  const loadCities = async (search?: string) => {
    setIsLoadingCities(true)
    try {
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
      // Filter offices and APS (both are valid for pickup)
      const filteredOffices = officesData.filter((office) => office.isAPS || !office.isMPS)

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

  const checkSaturdayAvailability = async (cityId: number) => {
    try {
      const available = await econtAPI.isSaturdayDeliveryAvailable(cityId)
      setSaturdayAvailable(available)
      if (!available) {
        setSaturdayDelivery(false)
      }
    } catch (error) {
      console.error("Failed to check Saturday availability:", error)
      setSaturdayAvailable(false)
    }
  }

  const calculateShipping = async () => {
    if (!selectedCity || !selectedOffice) return

    setIsCalculating(true)
    try {
      // Use Sofia (ID: 1) as sender city
      const calculationData = await econtAPI.calculateShipping({
        senderCityId: 1, // София като изпращач
        receiverCityId: selectedCity.id,
        weight: Math.max(cartWeight, 0.5), // Минимум 0.5кг
        shipmentType: "PACK",
        mode: selectedOffice.isAPS ? "aps" : "office",
        declaredValue: cartValue,
        saturdayDelivery,
      })

      setCalculation(calculationData)

      onDeliveryChange({
        method: "econt_office",
        price: calculationData.totalPrice,
        office: selectedOffice,
        city: selectedCity,
        deadline: calculationData.deliveryDeadline,
        saturdayDelivery,
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

  const handleSearchCities = () => {
    if (citySearch.length >= 2) {
      loadCities(citySearch)
      setShowCityResults(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5" />
          Доставка до офис на Еконт
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* City Selection */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            Град за доставка *
          </Label>
          <div className="flex gap-2">
            <Input
              id="city"
              placeholder="Въведете град..."
              value={citySearch}
              onChange={(e) => handleCitySearch(e.target.value)}
              onFocus={() => citySearch.length >= 2 && setShowCityResults(true)}
              className="text-sm"
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
                  <div className="font-medium text-sm">{city.name}</div>
                  <div className="text-xs text-gray-500">
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
            <p className="text-xs text-gray-500 p-3 border rounded-lg">Няма намерени градове за "{citySearch}"</p>
          )}
        </div>

        {/* Office Selection */}
        {selectedCity && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Изберете офис *</Label>
            {isLoadingOffices ? (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Зареждане на офиси...</span>
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
                        <div className="font-medium text-sm truncate flex items-center gap-2">
                          {office.name}
                          {office.isAPS && (
                            <Badge variant="secondary" className="text-xs">
                              Автомат 24/7
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{office.address.fullAddress}</div>
                        <div className="text-xs text-gray-400">
                          Работно време: {econtAPI.formatWorkingHours(office.normalBusinessHoursFrom)} -{" "}
                          {econtAPI.formatWorkingHours(office.normalBusinessHoursTo)}
                          {office.phones.length > 0 && ` • ${office.phones[0]}`}
                        </div>
                        {office.halfDayBusinessHoursFrom > 0 && (
                          <div className="text-xs text-gray-400">
                            Събота: {econtAPI.formatWorkingHours(office.halfDayBusinessHoursFrom)} -{" "}
                            {econtAPI.formatWorkingHours(office.halfDayBusinessHoursTo)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 p-3 border rounded-lg">Няма налични офиси в {selectedCity.name}</p>
            )}
          </div>
        )}

        {/* Saturday Delivery Option */}
        {selectedCity && selectedOffice && saturdayAvailable && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Checkbox id="saturday" checked={saturdayDelivery} onCheckedChange={setSaturdayDelivery} />
            <Label htmlFor="saturday" className="flex items-center gap-2 cursor-pointer">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Доставка в събота</span>
              <Badge variant="outline" className="text-xs">
                +3.00 лв
              </Badge>
            </Label>
          </div>
        )}

        {/* Calculation Result */}
        {selectedCity && selectedOffice && (
          <div className="p-3 bg-gray-50 rounded-lg">
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Изчисляване на цената...</span>
              </div>
            ) : calculation ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Цена за доставка:</span>
                  <span className="text-lg font-bold text-green-600">{calculation.totalPrice.toFixed(2)} лв</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Срок на доставка: {calculation.deliveryDeadline} работни дни
                    {saturdayDelivery && " (включително събота)"}
                  </span>
                  {selectedCity.expressCityDeliveries && (
                    <Badge variant="secondary" className="text-xs">
                      Експресна
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Доставка до:</strong> {selectedCity.name}, {selectedCity.regionName}
                </div>
                <div className="text-xs text-gray-600">
                  <strong>{selectedOffice.isAPS ? "Автомат" : "Офис"}:</strong> {selectedOffice.name}
                  <br />
                  <span className="truncate block">{selectedOffice.address.fullAddress}</span>
                </div>
                {saturdayDelivery && (
                  <div className="text-xs text-blue-600 font-medium">✓ Включена доставка в събота до 13:00 ч.</div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Изчисляване...</p>
            )}
          </div>
        )}

        {/* API Status */}
        <div className="text-xs text-gray-400 text-center">
          Използва реален Econt API • Данните се актуализират ежедневно
        </div>
      </CardContent>
    </Card>
  )
}
