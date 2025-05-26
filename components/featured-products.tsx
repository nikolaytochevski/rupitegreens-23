"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"

export function FeaturedProducts() {
  const { products } = useStore()

  // Get featured products (products with badges)
  const featuredProducts = products.filter((product) => product.badge).slice(0, 3)

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Популярни продукти</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Открийте нашите най-обичани туршии, приготвени с любов и традиция
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
            <Link href="/products">Виж всички продукти</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
