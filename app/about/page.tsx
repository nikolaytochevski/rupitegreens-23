import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Heart, Award, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-green-900">За RupiteGreens</h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
              Семейна традиция, предавана от поколение на поколение, за да ви предложим най-автентичните български
              туршии от сърцето на Рупите.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Нашата история</h2>
              <p className="text-gray-600 leading-relaxed">
                RupiteGreens започна като малко семейно предприятие в живописното село Рупите, известно със своите
                плодородни земи и уникален микроклимат. Още от 1985 година семейството ни се занимава с отглеждане на
                зеленчуци и приготвяне на туршии.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Днес продължаваме традицията, използвайки същите рецепти и методи, които са се предавали в семейството
                ни от поколения. Всеки буркан е приготвен с любов и внимание към детайла.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Нашата мисия е да запазим автентичния вкус на българската кухня и да го споделим с всички, които ценят
                качествените, натурални продукти.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Семейна традиция в Рупите"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Нашите ценности</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Това, което ни прави различни и защо клиентите ни се връщат отново и отново
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Натурални продукти</h3>
                <p className="text-gray-600 text-sm">
                  100% натурални съставки без консерванти, оцветители или изкуствени добавки
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Приготвено с любов</h3>
                <p className="text-gray-600 text-sm">Всеки продукт е приготвен ръчно с внимание към всеки детайл</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Високо качество</h3>
                <p className="text-gray-600 text-sm">Строг контрол на качеството на всеки етап от производството</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Семейна традиция</h3>
                <p className="text-gray-600 text-sm">Рецепти, предавани от поколение на поколение в семейството ни</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Нашият процес</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              От градината до вашата трапеза - как създаваме нашите туршии
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold">Отбиране на зеленчуци</h3>
              <p className="text-gray-600">
                Внимателно отбираме най-качествените зеленчуци от местни производители в района на Рупите
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold">Традиционно приготвяне</h3>
              <p className="text-gray-600">
                Използваме автентични рецепти и традиционни методи за приготвяне на туршиите
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold">Контрол на качеството</h3>
              <p className="text-gray-600">
                Всеки продукт преминава през строг контрол преди да стигне до вашата трапеза
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
