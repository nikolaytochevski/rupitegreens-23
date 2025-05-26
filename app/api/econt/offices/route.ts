import { type NextRequest, NextResponse } from "next/server"

const ECONT_API_BASE = "https://ee.econt.com/services"
const NOMENCLATURES_API = `${ECONT_API_BASE}/Nomenclatures`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get("cityId")
    const countryCode = searchParams.get("countryCode")

    console.log("Fetching offices from Econt API:", { cityId, countryCode })

    // Prepare request body for Econt API
    const requestBody: any = {}

    if (cityId) {
      requestBody.cityID = Number.parseInt(cityId)
    }
    if (countryCode) {
      requestBody.countryCode = countryCode
    }

    const response = await fetch(`${NOMENCLATURES_API}/NomenclaturesService.getOffices.json`, {
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
    console.log("Econt API offices response:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching offices:", error)

    // Return fallback mock data
    const cityId = request.nextUrl.searchParams.get("cityId")
    const mockOffices = getMockOffices(cityId ? Number.parseInt(cityId) : 0)
    return NextResponse.json({ offices: mockOffices })
  }
}

function getMockOffices(cityId: number) {
  const cityOffices: Record<number, any[]> = {
    1: [
      // София
      {
        id: 101,
        code: "1000",
        name: "София - Център",
        nameEn: "Sofia - Center",
        address: {
          id: null,
          city: { id: 1, name: "София", postCode: "1000" },
          fullAddress: "София ул. Витоша 1",
          quarter: "",
          street: "ул. Витоша",
          num: "1",
          other: "",
          location: { latitude: 42.6977, longitude: 23.3219, confidence: 3 },
          zip: null,
        },
        info: "Офис София Център",
        currency: "BGN",
        language: "bg",
        normalBusinessHoursFrom: 1524117600000,
        normalBusinessHoursTo: 1524150000000,
        halfDayBusinessHoursFrom: 1524117600000,
        halfDayBusinessHoursTo: 1524132000000,
        shipmentTypes: ["courier", "post"],
        partnerCode: "",
        hubCode: "1000",
        hubName: "София",
        hubNameEn: "Sofia",
        isMPS: false,
        isAPS: false,
        phones: ["+359 2 123 456"],
        emails: ["sofia@econt.com"],
      },
      {
        id: 102,
        code: "1001",
        name: "Автомат София Мол",
        nameEn: "Sofia Mall Automat",
        address: {
          id: null,
          city: { id: 1, name: "София", postCode: "1000" },
          fullAddress: "София бул. Александър Стамболийски 101",
          quarter: "",
          street: "бул. Александър Стамболийски",
          num: "101",
          other: "",
          location: { latitude: 42.6977, longitude: 23.3219, confidence: 3 },
          zip: null,
        },
        info: "Автомат 24/7",
        currency: "BGN",
        language: "bg",
        normalBusinessHoursFrom: 0,
        normalBusinessHoursTo: 86400000,
        halfDayBusinessHoursFrom: 0,
        halfDayBusinessHoursTo: 86400000,
        shipmentTypes: ["courier", "post"],
        partnerCode: "",
        hubCode: "1000",
        hubName: "София",
        hubNameEn: "Sofia",
        isMPS: false,
        isAPS: true,
        phones: [],
        emails: [],
      },
    ],
    7: [
      // Петрич
      {
        id: 701,
        code: "2850",
        name: "Петрич - Център",
        nameEn: "Petrich - Center",
        address: {
          id: null,
          city: { id: 7, name: "Петрич", postCode: "2850" },
          fullAddress: "Петрич ул. Цар Борис III 15",
          quarter: "",
          street: "ул. Цар Борис III",
          num: "15",
          other: "",
          location: { latitude: 41.3981, longitude: 23.2039, confidence: 3 },
          zip: null,
        },
        info: "Офис Петрич",
        currency: "BGN",
        language: "bg",
        normalBusinessHoursFrom: 1524117600000,
        normalBusinessHoursTo: 1524150000000,
        halfDayBusinessHoursFrom: 1524117600000,
        halfDayBusinessHoursTo: 1524132000000,
        shipmentTypes: ["courier", "post"],
        partnerCode: "",
        hubCode: "2850",
        hubName: "Петрич",
        hubNameEn: "Petrich",
        isMPS: false,
        isAPS: false,
        phones: ["+359 745 123 456"],
        emails: ["petrich@econt.com"],
      },
    ],
    8: [
      // Благоевград
      {
        id: 801,
        code: "2700",
        name: "Благоевград - Център",
        nameEn: "Blagoevgrad - Center",
        address: {
          id: null,
          city: { id: 8, name: "Благоевград", postCode: "2700" },
          fullAddress: "Благоевград ул. Македония 12",
          quarter: "",
          street: "ул. Македония",
          num: "12",
          other: "",
          location: { latitude: 42.0116, longitude: 23.0905, confidence: 3 },
          zip: null,
        },
        info: "Офис Благоевград",
        currency: "BGN",
        language: "bg",
        normalBusinessHoursFrom: 1524117600000,
        normalBusinessHoursTo: 1524150000000,
        halfDayBusinessHoursFrom: 1524117600000,
        halfDayBusinessHoursTo: 1524132000000,
        shipmentTypes: ["courier", "post"],
        partnerCode: "",
        hubCode: "2700",
        hubName: "Благоевград",
        hubNameEn: "Blagoevgrad",
        isMPS: false,
        isAPS: false,
        phones: ["+359 73 123 456"],
        emails: ["blagoevgrad@econt.com"],
      },
    ],
  }

  return cityOffices[cityId] || []
}
