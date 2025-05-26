"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Image from "next/image"

export function SearchBar() {
  const { searchQuery, setSearchQuery, products, clearAllFilters } = useStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof products>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (localQuery.trim().length > 0) {
      const filtered = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(localQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(localQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(localQuery.toLowerCase()),
        )
        .slice(0, 5)

      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [localQuery, products])

  const handleSearch = () => {
    const trimmedQuery = localQuery.trim()
    setSearchQuery(trimmedQuery)
    setShowSuggestions(false)

    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`)
    } else {
      router.push("/products")
    }
  }

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
    setShowSuggestions(false)

    if (pathname === "/products") {
      const params = new URLSearchParams(searchParams?.toString())
      params.delete("search")
      const newUrl = params.toString() ? `/products?${params.toString()}` : "/products"
      router.push(newUrl)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (productId: number) => {
    setShowSuggestions(false)
    setLocalQuery("")
    setSearchQuery("")
    router.push(`/products/${productId}`)
  }

  return (
    <div ref={searchRef} className="relative flex items-center gap-2 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Търсете продукти..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => localQuery.length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10 pr-10"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.id)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">{product.price.toFixed(2)} лв</span>
                  </div>
                ))}

                {localQuery.trim() && (
                  <div className="border-t pt-2 mt-2">
                    <button
                      onClick={handleSearch}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-md text-sm text-green-600 font-medium"
                    >
                      Покажи всички резултати за "{localQuery}"
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
        Търси
      </Button>
    </div>
  )
}
