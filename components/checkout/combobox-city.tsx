"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin } from "lucide-react"
import type { EcontCity } from "@/lib/econt-api"

interface ComboboxCityProps {
  selectedCity: EcontCity | null
  onCitySelect: (city: EcontCity) => void
  placeholder?: string
}

export function ComboboxCity({ selectedCity, onCitySelect, placeholder = "Търсете град..." }: ComboboxCityProps) {
  const [query, setQuery] = useState(selectedCity?.name || "")
  const [cities, setCities] = useState<EcontCity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (query.length >= 2) {
        searchCities(query)
      } else if (query.length === 0) {
        loadAllCities()
      } else {
        setCities([])
        setShowResults(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const loadAllCities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/econt/cities?countryCode=BGR")
      const data = await response.json()
      setCities(data.cities || [])
      setShowResults(true)
    } catch (error) {
      console.error("Failed to load cities:", error)
      setCities([])
    } finally {
      setIsLoading(false)
    }
  }

  const searchCities = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/econt/cities?countryCode=BGR&name=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setCities(data.cities || [])
      setShowResults(true)
    } catch (error) {
      console.error("Failed to search cities:", error)
      setCities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCitySelect = (city: EcontCity) => {
    setQuery(city.name)
    setShowResults(false)
    onCitySelect(city)
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    if (selectedCity && value !== selectedCity.name) {
      // Clear selection if user types different city
      onCitySelect(null as any)
    }
  }

  const handleFocus = () => {
    if (query.length >= 2) {
      setShowResults(true)
    } else if (query.length === 0) {
      loadAllCities()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {showResults && cities.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{city.name}</div>
                  <div className="text-xs text-gray-500">
                    {city.regionName} • {city.postCode}
                  </div>
                </div>
                {city.expressCityDeliveries && (
                  <Badge variant="secondary" className="text-xs">
                    Експресна
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && cities.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-3">
          <p className="text-sm text-gray-500 text-center">Няма намерени градове за "{query}"</p>
        </div>
      )}
    </div>
  )
}
