"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import { useStore } from "@/lib/store"
import { StepMethod } from "@/components/checkout/step-method"
import { StepAddress } from "@/components/checkout/step-address"
import { StepOffice } from "@/components/checkout/step-office"
import { StepSummary } from "@/components/checkout/step-summary"

type CheckoutStep = "method" | "address" | "office" | "summary"

export default function CheckoutPage() {
  const { cart, getCartItemsCount } = useStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("method")
  const [deliveryMethod, setDeliveryMethod] = useState<"door" | "office" | null>(null)

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cartItemsCount = getCartItemsCount()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto max-w-md px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Количката ви е празна</h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Не можете да продължите към поръчка без продукти в количката.
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Продължи пазаруването
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleMethodSelect = (method: "door" | "office") => {
    setDeliveryMethod(method)
    setCurrentStep(method === "door" ? "address" : "office")
  }

  const handleBackToMethod = () => {
    setCurrentStep("method")
    setDeliveryMethod(null)
  }

  const handleAddressComplete = () => {
    setCurrentStep("summary")
  }

  const handleOfficeComplete = () => {
    setCurrentStep("summary")
  }

  const getStepNumber = (step: CheckoutStep): number => {
    const steps = { method: 1, address: 2, office: 2, summary: 3 }
    return steps[step]
  }

  const isStepCompleted = (step: CheckoutStep): boolean => {
    const stepNumbers = { method: 1, address: 2, office: 2, summary: 3 }
    return stepNumbers[step] < getStepNumber(currentStep)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link href="/cart" className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm md:text-base">Обратно към количката</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Завършване на поръчката</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">{cartItemsCount} продукта в количката</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isStepCompleted("method") || currentStep === "method"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isStepCompleted("method") ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="ml-2 text-sm font-medium">Метод на доставка</span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-4" />

            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isStepCompleted("address") ||
                  isStepCompleted("office") ||
                  currentStep === "address" ||
                  currentStep === "office"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isStepCompleted("address") || isStepCompleted("office") ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className="ml-2 text-sm font-medium">
                {deliveryMethod === "door" ? "Адрес" : deliveryMethod === "office" ? "Офис" : "Детайли"}
              </span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-4" />

            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "summary" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep === "summary" ? <Check className="w-4 h-4" /> : "3"}
              </div>
              <span className="ml-2 text-sm font-medium">Обобщение</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6 md:p-8">
            {currentStep === "method" && <StepMethod onMethodSelect={handleMethodSelect} />}

            {currentStep === "address" && (
              <StepAddress onComplete={handleAddressComplete} onBack={handleBackToMethod} />
            )}

            {currentStep === "office" && <StepOffice onComplete={handleOfficeComplete} onBack={handleBackToMethod} />}

            {currentStep === "summary" && (
              <StepSummary deliveryMethod={deliveryMethod!} onEditDelivery={handleBackToMethod} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
