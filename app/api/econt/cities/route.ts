import { type NextRequest, NextResponse } from "next/server"

const ECONT_API_BASE = "https://ee.econt.com/services"
const NOMENCLATURES_API = `${ECONT_API_BASE}/Nomenclatures`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("countryCode") || "BGR"
    const name = searchParams.get("name")

    console.log("Fetching cities from Econt API:", { countryCode, name })

    // Prepare request body for Econt API
    const requestBody: any = {
      countryCode,
    }

    if (name) {
      requestBody.name = name
    }

    const response = await fetch(`${NOMENCLATURES_API}/NomenclaturesService.getCities.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      console.error("Econt API error:", response.status, response.statusText)
      throw new Error(`Econt API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Econt API response:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching cities:", error)

    // Return fallback mock data
    const mockCities = getMockCities(request.nextUrl.searchParams.get("name"))
    return NextResponse.json({ cities: mockCities })
  }
}

function getMockCities(nameFilter?: string | null) {
  const cities = [
    {
      id: 1,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "1000",
      name: "София",
      nameEn: "Sofia",
      regionName: "София-град",
      regionNameEn: "Sofia-city",
      phoneCode: "02",
      location: { latitude: 42.6977, longitude: 23.3219 },
      expressCityDeliveries: true,
    },
    {
      id: 2,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "4000",
      name: "Пловдив",
      nameEn: "Plovdiv",
      regionName: "Пловдив",
      regionNameEn: "Plovdiv",
      phoneCode: "032",
      location: { latitude: 42.1354, longitude: 24.7453 },
      expressCityDeliveries: true,
    },
    {
      id: 7,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "2850",
      name: "Петрич",
      nameEn: "Petrich",
      regionName: "Благоевград",
      regionNameEn: "Blagoevgrad",
      phoneCode: "0745",
      location: { latitude: 41.3981, longitude: 23.2039 },
      expressCityDeliveries: false,
    },
    {
      id: 8,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "2700",
      name: "Благоевград",
      nameEn: "Blagoevgrad",
      regionName: "Благоевград",
      regionNameEn: "Blagoevgrad",
      phoneCode: "073",
      location: { latitude: 42.0116, longitude: 23.0905 },
      expressCityDeliveries: false,
    },
    {
      id: 9,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "2800",
      name: "Сандански",
      nameEn: "Sandanski",
      regionName: "Благоевград",
      regionNameEn: "Blagoevgrad",
      phoneCode: "0746",
      location: { latitude: 41.5667, longitude: 23.2833 },
      expressCityDeliveries: false,
    },
    {
      id: 10,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "2820",
      name: "Рупите",
      nameEn: "Rupite",
      regionName: "Благоевград",
      regionNameEn: "Blagoevgrad",
      phoneCode: "0745",
      location: { latitude: 41.4167, longitude: 23.25 },
      expressCityDeliveries: false,
    },
    // Добавяме още градове
    {
      id: 11,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "9000",
      name: "Варна",
      nameEn: "Varna",
      regionName: "Варна",
      regionNameEn: "Varna",
      phoneCode: "052",
      location: { latitude: 43.2141, longitude: 27.9147 },
      expressCityDeliveries: true,
    },
    {
      id: 12,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "8000",
      name: "Бургас",
      nameEn: "Burgas",
      regionName: "Бургас",
      regionNameEn: "Burgas",
      phoneCode: "056",
      location: { latitude: 42.5048, longitude: 27.4626 },
      expressCityDeliveries: true,
    },
    {
      id: 13,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "7000",
      name: "Русе",
      nameEn: "Ruse",
      regionName: "Русе",
      regionNameEn: "Ruse",
      phoneCode: "082",
      location: { latitude: 43.8564, longitude: 25.9656 },
      expressCityDeliveries: false,
    },
    {
      id: 14,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "6000",
      name: "Стара Загора",
      nameEn: "Stara Zagora",
      regionName: "Стара Загора",
      regionNameEn: "Stara Zagora",
      phoneCode: "042",
      location: { latitude: 42.4258, longitude: 25.6342 },
      expressCityDeliveries: false,
    },
    {
      id: 15,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "3000",
      name: "Враца",
      nameEn: "Vratsa",
      regionName: "Враца",
      regionNameEn: "Vratsa",
      phoneCode: "092",
      location: { latitude: 43.2103, longitude: 23.5628 },
      expressCityDeliveries: false,
    },
    {
      id: 16,
      country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
      postCode: "5000",
      name: "Велико Търново",
      nameEn: "Veliko Tarnovo",
      regionName: "Велико Търново",
      regionNameEn: "Veliko Tarnovo",
      phoneCode: "062",
      location: { latitude: 43.0757, longitude: 25.6172 },
      expressCityDeliveries: false,
    },
  ]

  if (nameFilter) {
    const filter = nameFilter.toLowerCase()
    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(filter) ||
        city.nameEn.toLowerCase().includes(filter) ||
        city.regionName.toLowerCase().includes(filter),
    )
  }

  return cities
}
