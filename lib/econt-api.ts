// Updated Econt API client to use our backend routes
export interface EcontCountry {
  id: number | null
  code2: string
  code3: string
  name: string
  nameEn: string
  isEU: boolean
}

export interface EcontCity {
  id: number
  country: EcontCountry
  postCode: string
  name: string
  nameEn: string
  regionName: string
  regionNameEn: string
  phoneCode: string
  location: {
    latitude: number
    longitude: number
  } | null
  expressCityDeliveries: boolean
}

export interface EcontOffice {
  id: number
  code: string
  name: string
  nameEn: string
  address: {
    id: number | null
    city: EcontCity
    fullAddress: string
    quarter: string
    street: string
    num: string
    other: string
    location: {
      latitude: number
      longitude: number
      confidence: number
    } | null
    zip: string | null
  }
  info: string
  currency: string
  language: string
  normalBusinessHoursFrom: number
  normalBusinessHoursTo: number
  halfDayBusinessHoursFrom: number
  halfDayBusinessHoursTo: number
  shipmentTypes: string[]
  partnerCode: string
  hubCode: string
  hubName: string
  hubNameEn: string
  isMPS: boolean // Mobile office
  isAPS: boolean // Automat (Econtomats)
  phones: string[]
  emails: string[]
}

export interface EcontCalculateRequest {
  senderCityId: number
  receiverCityId: number
  weight: number
  shipmentType: "PACK" | "DOCUMENT" | "PALLET"
  mode: "office" | "door" | "aps"
  declaredValue?: number
  saturdayDelivery?: boolean
}

export interface EcontCalculateResponse {
  totalPrice: number
  currency: string
  deliveryDeadline: number
  pickupDate: string
  deliveryDate: string
  saturdayDelivery?: boolean
}

class EcontAPI {
  private async makeRequest<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      console.log("Making request to:", url)

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("API response:", data)
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async getCities(countryCode = "BGR", nameFilter?: string): Promise<EcontCity[]> {
    try {
      const params = new URLSearchParams({ countryCode })
      if (nameFilter) {
        params.append("name", nameFilter)
      }

      const response = await this.makeRequest<{ cities: EcontCity[] }>(`/api/econt/cities?${params.toString()}`)

      return response.cities || []
    } catch (error) {
      console.error("Failed to fetch cities:", error)
      return []
    }
  }

  async getOffices(cityId?: number, countryCode?: string): Promise<EcontOffice[]> {
    try {
      const params = new URLSearchParams()
      if (cityId) params.append("cityId", cityId.toString())
      if (countryCode) params.append("countryCode", countryCode)

      const response = await this.makeRequest<{ offices: EcontOffice[] }>(`/api/econt/offices?${params.toString()}`)

      return response.offices || []
    } catch (error) {
      console.error("Failed to fetch offices:", error)
      return []
    }
  }

  async getQuarters(cityId: number): Promise<any[]> {
    return []
  }

  async getStreets(cityId: number, quarterName?: string): Promise<any[]> {
    return []
  }

  async validateAddress(address: {
    city: { country: { code2: string }; name: string }
    street?: string
    num?: string
    quarter?: string
  }): Promise<any> {
    return null as any
  }

  async calculateShipping(req: EcontCalculateRequest): Promise<EcontCalculateResponse> {
    try {
      const response = await this.makeRequest<EcontCalculateResponse>("/api/econt/calculate", {
        method: "POST",
        body: JSON.stringify(req),
      })

      return response
    } catch (error) {
      console.error("Failed to calculate shipping:", error)
      throw error
    }
  }

  // Helper method to check if Saturday delivery is available for a city
  async isSaturdayDeliveryAvailable(cityId: number): Promise<boolean> {
    try {
      const offices = await this.getOffices(cityId)
      // Check if any office has Saturday working hours
      return offices.some((office) => office.halfDayBusinessHoursFrom > 0 && office.halfDayBusinessHoursTo > 0)
    } catch (error) {
      console.error("Failed to check Saturday delivery:", error)
      return false
    }
  }

  // Helper method to get working hours in readable format
  formatWorkingHours(timestamp: number): string {
    if (!timestamp) return "Не работи"

    // Handle 24/7 automats
    if (timestamp === 0) return "00:00"
    if (timestamp === 86400000) return "24:00"

    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  private calculateDeliveryDate(deadline: number): string {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + deadline)
    return deliveryDate.toISOString().slice(0, 10)
  }

  private getMockCities(nameFilter?: string): EcontCity[] {
    const cities: EcontCity[] = [
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
      // Добавяме Петрич и други градове
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
      {
        id: 11,
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
        id: 12,
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
      {
        id: 13,
        country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
        postCode: "1700",
        name: "Банкя",
        nameEn: "Bankya",
        regionName: "София",
        regionNameEn: "Sofia",
        phoneCode: "02",
        location: { latitude: 42.65, longitude: 23.1167 },
        expressCityDeliveries: true,
      },
      {
        id: 14,
        country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
        postCode: "2000",
        name: "Самоков",
        nameEn: "Samokov",
        regionName: "София",
        regionNameEn: "Sofia",
        phoneCode: "0722",
        location: { latitude: 42.3333, longitude: 23.55 },
        expressCityDeliveries: false,
      },
      {
        id: 15,
        country: { id: 1, code2: "BG", code3: "BGR", name: "България", nameEn: "Bulgaria", isEU: true },
        postCode: "2100",
        name: "Годеч",
        nameEn: "Godech",
        regionName: "София",
        regionNameEn: "Sofia",
        phoneCode: "0726",
        location: { latitude: 43.0333, longitude: 22.85 },
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

  private getMockOffices(cityId: number): EcontOffice[] {
    const mockOffice = (id: number, code: string, name: string, cityData: any, isAPS = false): EcontOffice => ({
      id,
      code,
      name,
      nameEn: name,
      address: {
        id: null,
        city: cityData,
        fullAddress: `${cityData.name} ул. Примерна ${id}`,
        quarter: "",
        street: `ул. Примерна`,
        num: id.toString(),
        other: "",
        location: cityData.location,
        zip: null,
      },
      info: `Офис ${name}`,
      currency: "BGN",
      language: "bg",
      normalBusinessHoursFrom: 1524117600000, // 08:30
      normalBusinessHoursTo: 1524150000000, // 18:00
      halfDayBusinessHoursFrom: isAPS ? 1524117600000 : 1524117600000, // 08:30
      halfDayBusinessHoursTo: isAPS ? 1524150000000 : 1524132000000, // 13:00 or 18:00 for APS
      shipmentTypes: ["courier", "post"],
      partnerCode: "",
      hubCode: code,
      hubName: cityData.name,
      hubNameEn: cityData.nameEn,
      isMPS: false,
      isAPS,
      phones: [`+359 ${cityData.phoneCode} 123 456`],
      emails: [`${code}@econt.com`],
    })

    const cityData = this.getMockCities().find((c) => c.id === cityId)
    if (!cityData) return []

    return [
      mockOffice(101, `${cityData.postCode}1`, `${cityData.name} - Център`, cityData),
      mockOffice(102, `${cityData.postCode}2`, `Автомат ${cityData.name} Мол`, cityData, true),
    ]
  }

  private getMockCalculation(req: EcontCalculateRequest): EcontCalculateResponse {
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
    const expressCities = [1, 2, 3, 4] // София, Пловдив, Варна, Бургас
    const isExpressDelivery = expressCities.includes(req.receiverCityId)
    let deliveryDeadline = isExpressDelivery ? 1 : 2

    // Saturday delivery affects deadline
    if (req.saturdayDelivery) {
      deliveryDeadline = 1 // Same day Saturday delivery
    }

    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDeadline)

    return {
      totalPrice: Math.round(basePrice * 100) / 100,
      currency: "BGN",
      deliveryDeadline,
      pickupDate: new Date().toISOString().slice(0, 10),
      deliveryDate: deliveryDate.toISOString().slice(0, 10),
      saturdayDelivery: req.saturdayDelivery,
    }
  }
}

export const econtAPI = new EcontAPI()
