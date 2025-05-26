import { type NextRequest, NextResponse } from "next/server"

const ECONT_API_BASE = "https://ee.econt.com/services"
const SHIPMENTS_API = `${ECONT_API_BASE}/Shipments`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Calculating shipping with Econt API:", body)

    const requestData: any = {
      senderCityId: body.senderCityId,
      receiverCityId: body.receiverCityId,
      weight: body.weight,
      shipmentType: body.shipmentType || "PACK",
      mode: body.mode || "office",
      declaredValue: body.declaredValue || 0,
    }

    // Add Saturday delivery service if requested
    if (body.saturdayDelivery) {
      requestData.services = [
        {
          type: "PRIORITY_TIME",
          timeTo: "13:00",
        },
      ]
    }

    const response = await fetch(`${SHIPMENTS_API}/ShipmentService.calculateShipmentPrice.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      console.error("Econt API error:", response.status, response.statusText)
      throw new Error(`Econt API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Econt API calculation response:", data)

    // Normalize response
    const result = {
      totalPrice: data.totalPrice ?? data.price ?? 0,
      currency: data.currency ?? "BGN",
      deliveryDeadline: data.deliveryDeadline ?? data.deadline ?? 2,
      pickupDate: data.pickupDate ?? new Date().toISOString().slice(0, 10),
      deliveryDate: data.deliveryDate ?? calculateDeliveryDate(data.deliveryDeadline ?? 2),
      saturdayDelivery: body.saturdayDelivery,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calculating shipping:", error)

    // Return fallback mock calculation
    const body = await request.json()
    const mockCalculation = getMockCalculation(body)
    return NextResponse.json(mockCalculation)
  }
}

function calculateDeliveryDate(deadline: number): string {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + deadline)
  return deliveryDate.toISOString().slice(0, 10)
}

function getMockCalculation(req: any) {
  let basePrice = 5.99

  // Different pricing based on cities
  if (req.senderCityId !== req.receiverCityId) {
    basePrice = 8.99
  }

  // Door delivery surcharge
  if (req.mode === "door") {
    basePrice += 2.0
  }

  // Saturday delivery surcharge
  if (req.saturdayDelivery) {
    basePrice += 3.0
  }

  // Weight-based pricing
  if (req.weight > 1) {
    basePrice += (req.weight - 1) * 0.5
  }

  // Express delivery for major cities
  const expressCities = [1, 2, 11, 12] // София, Пловдив, Варна, Бургас
  const isExpressDelivery = expressCities.includes(req.receiverCityId)
  let deliveryDeadline = isExpressDelivery ? 1 : 2

  // Saturday delivery affects deadline
  if (req.saturdayDelivery) {
    deliveryDeadline = 1
  }

  return {
    totalPrice: Math.round(basePrice * 100) / 100,
    currency: "BGN",
    deliveryDeadline,
    pickupDate: new Date().toISOString().slice(0, 10),
    deliveryDate: calculateDeliveryDate(deliveryDeadline),
    saturdayDelivery: req.saturdayDelivery,
  }
}
