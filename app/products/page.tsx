"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { useSearchParams, useRouter } from "next/navigation"

const categories = ["Всички", "Краставички", "Лютеници", "Зеленчуци", "Смесени", "Чушки"]

export default function ProductsPage() {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    clearAllFilters,
    getFilteredProducts,
  } = useStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const filteredProducts = getFilteredProducts()

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Handle URL search params
  useEffect(() => {
    const searchFromUrl = searchParams?.get("search") || ""
    const categoryFromUrl = searchParams?.get("category") || "Всички"

    // Only update if different to avoid infinite loops
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl)
    }

    if (categoryFromUrl !== selectedCategory && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  const handleClearSearch = () => {
    setSearchQuery("")

    // Create new URL params without search
    const params = new URLSearchParams(searchParams?.toString())
    params.delete("search")

    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products"
    router.push(newUrl)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)

    // Create new URL params
    const params = new URLSearchParams(searchParams?.toString())

    if (category === "Всички") {
      params.delete("category")
    } else {
      params.set("category", category)
    }

    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products"
    router.push(newUrl)
  }

  const handleClearAllFilters = () => {
    clearAllFilters()
    router.push("/products")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Резултати за "${searchQuery}"` : "Всички продукти"}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {searchQuery
              ? `Намерени ${filteredProducts.length} продукта`
              : "Открийте нашата пълна колекция от традиционни български туршии"}
          </p>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory !== "Всички") && (
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h3 className="font-medium text-gray-900">Активни филтри:</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllFilters}
                className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-1" />
                Изчисти всички
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-2">
                  Търсене: "{searchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== "Всички" && (
                <Badge variant="secondary" className="gap-2">
                  Категория: {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryChange("Всички")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="mb-6 md:mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Категории:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-green-50 border-green-200"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Сортиране:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">По име (А-Я)</SelectItem>
                  <SelectItem value="price-low">Цена (ниска към висока)</SelectItem>
                  <SelectItem value="price-high">Цена (висока към ниска)</SelectItem>
                  <SelectItem value="rating">По рейтинг</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchQuery ? "Не са намерени продукти за вашето търсене" : "Няма продукти в тази категория"}
            </p>
            <Button onClick={handleClearAllFilters} className="bg-green-600 hover:bg-green-700">
              Покажи всички продукти
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
