"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Truck, Shield, Leaf } from "lucide-react"
import { FeaturedProducts } from "@/components/featured-products"

export default function HomePage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-green-100 py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-green-900">RupiteGreens</h1>
              <p className="text-lg md:text-xl text-green-700 leading-relaxed">
                Автентични български туршии, приготвени по традиционни рецепти с най-качествени съставки от Рупите.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/products">Разгледай продуктите</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                  <Link href="/about">Научи повече</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Традиционни български туршии"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">100% Натурални</h3>
              <p className="text-gray-600 text-sm md:text-base">Без консерванти и изкуствени добавки</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Бърза доставка</h3>
              <p className="text-gray-600 text-sm md:text-base">Доставка до 24 часа в София</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Гарантирано качество</h3>
              <p className="text-gray-600 text-sm md:text-base">30 дни гаранция за връщане</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Нашата история</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                RupiteGreens е семейна фирма, която продължава традицията на приготвяне на автентични български туршии.
                Използваме само най-качествени зеленчуци, отглеждани в екологично чистия район на Рупите.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Всеки продукт е приготвен ръчно по рецепти, предавани от поколение на поколение, за да ви предложим
                истинския вкус на българската традиция.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/about">Научи повече за нас</Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Семейна традиция"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
