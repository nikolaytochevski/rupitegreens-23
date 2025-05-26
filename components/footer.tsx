import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RG</span>
              </div>
              <span className="font-bold text-xl">RupiteGreens</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Автентични български туршии, приготвени по традиционни рецепти с най-качествени съставки от Рупите.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Бързи връзки</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-gray-400 hover:text-green-400 transition-colors">
                Всички продукти
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-green-400 transition-colors">
                За нас
              </Link>
              <Link href="/delivery" className="block text-gray-400 hover:text-green-400 transition-colors">
                Доставка
              </Link>
              <Link href="/returns" className="block text-gray-400 hover:text-green-400 transition-colors">
                Връщания
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Категории</h3>
            <div className="space-y-2">
              <Link
                href="/products?category=krastavichki"
                className="block text-gray-400 hover:text-green-400 transition-colors"
              >
                Краставички
              </Link>
              <Link
                href="/products?category=lyutenici"
                className="block text-gray-400 hover:text-green-400 transition-colors"
              >
                Лютеници
              </Link>
              <Link
                href="/products?category=zelenchutsi"
                className="block text-gray-400 hover:text-green-400 transition-colors"
              >
                Зеленчуци
              </Link>
              <Link
                href="/products?category=smeseni"
                className="block text-gray-400 hover:text-green-400 transition-colors"
              >
                Смесени
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Контакти</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">+359 888 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">info@rupitegreens.bg</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  с. Рупите
                  <br />
                  обл. Благоевград
                  <br />
                  България
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 RupiteGreens. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  )
}
