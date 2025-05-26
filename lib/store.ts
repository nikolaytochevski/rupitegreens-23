import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  category: string
  badge?: string
  description: string
  ingredients: string[]
  weight: string
  inStock: boolean
  stockQuantity: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface DeliveryInfo {
  method: "door" | "office"
  price: number
  city?: any
  office?: any
  deadline: number
  address?: {
    street: string
    quarter?: string
    notes?: string
  }
}

interface StoreState {
  products: Product[]
  cart: CartItem[]
  favorites: number[]
  searchQuery: string
  selectedCategory: string
  sortBy: string
  deliveryInfo: DeliveryInfo | null

  // Actions
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  toggleFavorite: (productId: number) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setSortBy: (sortBy: string) => void
  setDeliveryInfo: (delivery: DeliveryInfo | null) => void
  clearAllFilters: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
  getCartWeight: () => number
  getDeliveryFee: () => number
  getFinalTotal: () => number
  getFilteredProducts: () => Product[]
}

const products: Product[] = [
  {
    id: 1,
    name: "Класически краставички",
    price: 8.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 124,
    category: "Краставички",
    badge: "Бестселър",
    description:
      "Традиционни български краставички, приготвени по автентична рецепта. Хрупкави и ароматни, идеални за всяка трапеза.",
    ingredients: ["Краставички", "Вода", "Оцет", "Сол", "Захар", "Копър"],
    weight: "720г",
    inStock: true,
    stockQuantity: 45,
  },
  {
    id: 2,
    name: "Лютеница домашна",
    price: 12.5,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 89,
    category: "Лютеници",
    badge: "Ново",
    description: "Домашна лютеница с богат вкус и аромат. Приготвена от най-качествени червени чушки и домати.",
    ingredients: ["Червени чушки", "Домати", "Лук", "Чесън", "Олио", "Сол", "Захар"],
    weight: "550г",
    inStock: true,
    stockQuantity: 32,
  },
  {
    id: 3,
    name: "Смесени зеленчуци",
    price: 10.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 156,
    category: "Смесени",
    badge: "Популярно",
    description: "Цветна смес от сезонни зеленчуци, богата на витамини и минерали.",
    ingredients: ["Карфиол", "Моркови", "Зеле", "Чушки", "Оцет", "Сол"],
    weight: "680г",
    inStock: true,
    stockQuantity: 28,
  },
  {
    id: 4,
    name: "Туршия от карфиол",
    price: 9.5,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 78,
    category: "Зеленчуци",
    description: "Нежен карфиол в ароматна туршия, богат на витамини и полезни вещества.",
    ingredients: ["Карфиол", "Вода", "Оцет", "Сол", "Лаврови листа"],
    weight: "650г",
    inStock: true,
    stockQuantity: 22,
  },
  {
    id: 5,
    name: "Кисели краставички",
    price: 7.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 203,
    category: "Краставички",
    description: "Традиционни кисели краставички с неповторим вкус и аромат.",
    ingredients: ["Краставички", "Вода", "Сол", "Чесън", "Копър"],
    weight: "700г",
    inStock: true,
    stockQuantity: 67,
  },
  {
    id: 6,
    name: "Туршия от зеле",
    price: 6.5,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 92,
    category: "Зеленчуци",
    description: "Хрупкаво зеле в традиционна туршия, богато на витамин C.",
    ingredients: ["Зеле", "Моркови", "Вода", "Оцет", "Сол"],
    weight: "750г",
    inStock: true,
    stockQuantity: 41,
  },
  {
    id: 7,
    name: "Лютеница с орехи",
    price: 14.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 67,
    category: "Лютеници",
    badge: "Премиум",
    description: "Премиум лютеница обогатена с орехи за неповторим вкус и текстура.",
    ingredients: ["Червени чушки", "Домати", "Орехи", "Лук", "Чесън", "Олио"],
    weight: "500г",
    inStock: true,
    stockQuantity: 18,
  },
  {
    id: 8,
    name: "Туршия от моркови",
    price: 8.5,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 45,
    category: "Зеленчуци",
    description: "Сладки моркови в ароматна туршия, богати на бета-каротин.",
    ingredients: ["Моркови", "Вода", "Оцет", "Сол", "Захар", "Лаврови листа"],
    weight: "600г",
    inStock: true,
    stockQuantity: 35,
  },
  {
    id: 9,
    name: "Пикантни чушки",
    price: 11.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 134,
    category: "Чушки",
    description: "Остри чушки за любителите на пикантните вкусове.",
    ingredients: ["Остри чушки", "Вода", "Оцет", "Сол", "Чесън"],
    weight: "450г",
    inStock: true,
    stockQuantity: 29,
  },
  {
    id: 10,
    name: "Туршия от цвекло",
    price: 7.5,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.3,
    reviews: 56,
    category: "Зеленчуци",
    description: "Сочно цвекло в традиционна туршия с наситен цвят и вкус.",
    ingredients: ["Цвекло", "Вода", "Оцет", "Сол", "Захар"],
    weight: "650г",
    inStock: false,
    stockQuantity: 0,
  },
  {
    id: 11,
    name: "Айвар класик",
    price: 13.5,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 98,
    category: "Лютеници",
    description: "Класически айвар с богат вкус на печени чушки и патладжани.",
    ingredients: ["Червени чушки", "Патладжани", "Лук", "Чесън", "Олио", "Сол"],
    weight: "480г",
    inStock: true,
    stockQuantity: 24,
  },
  {
    id: 12,
    name: "Смесена салата",
    price: 9.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 112,
    category: "Смесени",
    description: "Разнообразна салата от сезонни зеленчуци в ароматна туршия.",
    ingredients: ["Домати", "Краставички", "Чушки", "Лук", "Оцет", "Олио", "Сол"],
    weight: "620г",
    inStock: true,
    stockQuantity: 33,
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products,
      cart: [],
      favorites: [],
      searchQuery: "",
      selectedCategory: "Всички",
      sortBy: "name",
      deliveryInfo: null,

      addToCart: (product) => {
        const cart = get().cart
        const existingItem = cart.find((item) => item.id === product.id)

        if (existingItem) {
          set({
            cart: cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({
            cart: [...cart, { ...product, quantity: 1 }],
          })
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        })
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        set({
          cart: get().cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => {
        set({ cart: [], deliveryInfo: null })
      },

      toggleFavorite: (productId) => {
        const favorites = get().favorites
        const isFavorite = favorites.includes(productId)

        set({
          favorites: isFavorite ? favorites.filter((id) => id !== productId) : [...favorites, productId],
        })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category })
      },

      setSortBy: (sortBy) => {
        set({ sortBy })
      },

      setDeliveryInfo: (delivery) => {
        set({ deliveryInfo: delivery })
      },

      clearAllFilters: () => {
        set({
          searchQuery: "",
          selectedCategory: "Всички",
        })
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },

      getCartWeight: () => {
        return get().cart.reduce((total, item) => {
          const weightStr = item.weight.replace(/[^\d.]/g, "")
          const weight = Number.parseFloat(weightStr) || 500
          return total + (weight / 1000) * item.quantity
        }, 0)
      },

      getDeliveryFee: () => {
        return get().deliveryInfo?.price || 0
      },

      getFinalTotal: () => {
        return get().getCartTotal() + get().getDeliveryFee()
      },

      getFilteredProducts: () => {
        const { products, searchQuery, selectedCategory, sortBy } = get()

        const filtered = products.filter((product) => {
          const matchesSearch =
            !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesCategory = selectedCategory === "Всички" || product.category === selectedCategory

          return matchesSearch && matchesCategory
        })

        filtered.sort((a, b) => {
          switch (sortBy) {
            case "price-low":
              return a.price - b.price
            case "price-high":
              return b.price - a.price
            case "rating":
              return b.rating - a.rating
            case "name":
            default:
              return a.name.localeCompare(b.name, "bg")
          }
        })

        return filtered
      },
    }),
    {
      name: "rupite-greens-store",
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        deliveryInfo: state.deliveryInfo,
      }),
    },
  ),
)
