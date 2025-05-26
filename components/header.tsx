"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart, User } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { CartSidebar } from "@/components/cart-sidebar"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">RG</span>
            </div>
            <span className="font-bold text-xl text-green-900">RupiteGreens</span>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center px-8">
            <SearchBar />
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Начало
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">
              Продукти
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              За нас
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Контакти
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
            <CartSidebar />
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <CartSidebar />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="pb-4">
                    <SearchBar />
                  </div>
                  <Link href="/" className="text-lg font-medium">
                    Начало
                  </Link>
                  <Link href="/products" className="text-lg font-medium">
                    Продукти
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    За нас
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    Контакти
                  </Link>
                  <div className="flex items-center space-x-4 pt-6 border-t">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
