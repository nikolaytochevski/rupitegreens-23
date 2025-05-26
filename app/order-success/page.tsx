import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"

export default function OrderSuccessPage() {
  const orderNumber = "RG" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Поръчката е изпратена успешно!</h1>
          <p className="text-gray-600 text-lg">
            Благодарим ви за поръчката! Ще получите потвърждение на имейла си в рамките на няколко минути.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Номер на поръчката: {orderNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Package className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="font-semibold">Обработка</h3>
                <p className="text-sm text-gray-600">Вашата поръчка се обработва</p>
              </div>
              <div className="space-y-2">
                <Truck className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="font-semibold text-gray-400">Доставка</h3>
                <p className="text-sm text-gray-400">2-3 работни дни</p>
              </div>
              <div className="space-y-2">
                <Mail className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="font-semibold text-gray-400">Потвърждение</h3>
                <p className="text-sm text-gray-400">Имейл с детайли</p>
              </div>
            </div>

            <div className="text-center space-y-4 pt-6 border-t">
              <p className="text-gray-600">
                Ще получите имейл с детайли за поръчката и номер за проследяване на пратката.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button className="bg-green-600 hover:bg-green-700">Продължи пазаруването</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Свържи се с нас</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Имате въпроси? Свържете се с нас на +359 888 123 456 или info@rupitegreens.bg</p>
        </div>
      </div>
    </div>
  )
}
