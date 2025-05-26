import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Свържете се с нас</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Имате въпроси за нашите продукти? Искате да направите специална поръчка? Ще се радваме да чуем от вас!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Изпратете ни съобщение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Име</Label>
                  <Input id="firstName" placeholder="Вашето име" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input id="lastName" placeholder="Вашата фамилия" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Имейл</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" type="tel" placeholder="+359 888 123 456" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Тема</Label>
                <Input id="subject" placeholder="Относно какво искате да ни пишете?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Съобщение</Label>
                <Textarea id="message" placeholder="Вашето съобщение..." className="min-h-[120px]" />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Изпрати съобщение</Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Информация за контакт</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Адрес</h3>
                    <p className="text-gray-600">
                      с. Рупите
                      <br />
                      обл. Благоевград
                      <br />
                      България 2820
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Телефон</h3>
                    <p className="text-gray-600">+359 888 123 456</p>
                    <p className="text-gray-600">+359 2 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Имейл</h3>
                    <p className="text-gray-600">info@rupitegreens.bg</p>
                    <p className="text-gray-600">orders@rupitegreens.bg</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Работно време</h3>
                    <p className="text-gray-600">
                      Понеделник - Петък: 9:00 - 18:00
                      <br />
                      Събота: 9:00 - 14:00
                      <br />
                      Неделя: Почивен ден
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Доставка и поръчки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  <strong>Безплатна доставка</strong> за поръчки над 50 лв в София
                </p>
                <p className="text-gray-600">
                  <strong>Експресна доставка</strong> до 24 часа в София и околностите
                </p>
                <p className="text-gray-600">
                  <strong>Доставка в цялата страна</strong> с Еконт и Спиди
                </p>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  Вижте условията за доставка
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
