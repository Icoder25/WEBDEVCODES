import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  AppState,
  User,
  Cart,
  CartItem,
  SearchFilters,
  Toast,
} from '@/types'
import { generateId, calculateGST } from '@/lib/utils'

const initialCart: Cart = {
  id: generateId(),
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  updatedAt: new Date(),
}

const initialSearchFilters: SearchFilters = {
  query: '',
  sortBy: 'relevance',
  page: 1,
  limit: 12,
}

export const useAppStore = create<AppState>()()
  persist(
    immer((set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => {
        set((state) => {
          state.theme = theme
        })
      },

      // User
      user: null,
      setUser: (user) => {
        set((state) => {
          state.user = user
        })
      },

      // Cart
      cart: initialCart,
      addToCart: (newItem) => {
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.selectedColor === newItem.selectedColor &&
              item.selectedSize === newItem.selectedSize
          )

          if (existingItemIndex >= 0) {
            // Update existing item
            const existingItem = state.cart.items[existingItemIndex]
            existingItem.quantity += newItem.quantity
            existingItem.totalPrice = existingItem.quantity * existingItem.pricePerUnit
          } else {
            // Add new item
            const cartItem: CartItem = {
              id: generateId(),
              ...newItem,
              totalPrice: newItem.quantity * newItem.pricePerUnit,
              addedAt: new Date(),
            }
            state.cart.items.push(cartItem)
          }

          // Recalculate totals
          const subtotal = state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
          const tax = calculateGST(subtotal)
          const shipping = subtotal > 500 ? 0 : 50 // Free shipping above ₹500
          const total = subtotal + tax + shipping - state.cart.discount

          state.cart.subtotal = subtotal
          state.cart.tax = tax
          state.cart.shipping = shipping
          state.cart.total = Math.max(0, total)
          state.cart.updatedAt = new Date()
        })
      },

      removeFromCart: (itemId) => {
        set((state) => {
          state.cart.items = state.cart.items.filter((item) => item.id !== itemId)

          // Recalculate totals
          const subtotal = state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
          const tax = calculateGST(subtotal)
          const shipping = subtotal > 500 ? 0 : 50
          const total = subtotal + tax + shipping - state.cart.discount

          state.cart.subtotal = subtotal
          state.cart.tax = tax
          state.cart.shipping = shipping
          state.cart.total = Math.max(0, total)
          state.cart.updatedAt = new Date()
        })
      },

      updateCartItem: (itemId, updates) => {
        set((state) => {
          const itemIndex = state.cart.items.findIndex((item) => item.id === itemId)
          if (itemIndex >= 0) {
            const item = state.cart.items[itemIndex]
            Object.assign(item, updates)
            
            if (updates.quantity !== undefined) {
              item.totalPrice = item.quantity * item.pricePerUnit
            }

            // Recalculate totals
            const subtotal = state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
            const tax = calculateGST(subtotal)
            const shipping = subtotal > 500 ? 0 : 50
            const total = subtotal + tax + shipping - state.cart.discount

            state.cart.subtotal = subtotal
            state.cart.tax = tax
            state.cart.shipping = shipping
            state.cart.total = Math.max(0, total)
            state.cart.updatedAt = new Date()
          }
        })
      },

      clearCart: () => {
        set((state) => {
          state.cart = { ...initialCart, id: generateId() }
        })
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        set((state) => {
          if (!state.wishlist.includes(productId)) {
            state.wishlist.push(productId)
          }
        })
      },

      removeFromWishlist: (productId) => {
        set((state) => {
          state.wishlist = state.wishlist.filter((id) => id !== productId)
        })
      },

      // Search
      searchQuery: '',
      setSearchQuery: (query) => {
        set((state) => {
          state.searchQuery = query
        })
      },

      searchFilters: initialSearchFilters,
      setSearchFilters: (filters) => {
        set((state) => {
          Object.assign(state.searchFilters, filters)
        })
      },

      // UI State
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => {
        set((state) => {
          state.isMobileMenuOpen = open
        })
      },

      isCartOpen: false,
      setCartOpen: (open) => {
        set((state) => {
          state.isCartOpen = open
        })
      },

      isSearchOpen: false,
      setSearchOpen: (open) => {
        set((state) => {
          state.isSearchOpen = open
        })
      },

      // Toasts
      toasts: [],
      addToast: (toast) => {
        set((state) => {
          const newToast: Toast = {
            id: generateId(),
            duration: 5000,
            ...toast,
          }
          state.toasts.push(newToast)

          // Auto remove toast after duration
          if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
              get().removeToast(newToast.id)
            }, newToast.duration)
          }
        })
      },

      removeToast: (id) => {
        set((state) => {
          state.toasts = state.toasts.filter((toast) => toast.id !== id)
        })
      },

      // Loading states
      isLoading: {},
      setLoading: (key, loading) => {
        set((state) => {
          state.isLoading[key] = loading
        })
      },
    })),
    {
      name: 'shubham-enterprise-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        cart: state.cart,
        wishlist: state.wishlist,
        searchFilters: {
          ...state.searchFilters,
          page: 1, // Reset page on reload
        },
      }),
    }
  )

// Selectors for better performance
export const useTheme = () => useAppStore((state) => state.theme)
export const useUser = () => useAppStore((state) => state.user)
export const useCart = () => useAppStore((state) => state.cart)
export const useCartItems = () => useAppStore((state) => state.cart.items)
export const useCartTotal = () => useAppStore((state) => state.cart.total)
export const useCartItemCount = () => useAppStore((state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0)
)
export const useWishlist = () => useAppStore((state) => state.wishlist)
export const useSearchQuery = () => useAppStore((state) => state.searchQuery)
export const useSearchFilters = () => useAppStore((state) => state.searchFilters)
export const useToasts = () => useAppStore((state) => state.toasts)
export const useLoading = (key: string) => useAppStore((state) => state.isLoading[key] || false)

// UI State selectors
export const useMobileMenu = () => useAppStore((state) => ({
  isOpen: state.isMobileMenuOpen,
  setOpen: state.setMobileMenuOpen,
}))

export const useCartDrawer = () => useAppStore((state) => ({
  isOpen: state.isCartOpen,
  setOpen: state.setCartOpen,
}))

export const useSearchModal = () => useAppStore((state) => ({
  isOpen: state.isSearchOpen,
  setOpen: state.setSearchOpen,
}))

// Action selectors
export const useCartActions = () => useAppStore((state) => ({
  addToCart: state.addToCart,
  removeFromCart: state.removeFromCart,
  updateCartItem: state.updateCartItem,
  clearCart: state.clearCart,
}))

export const useWishlistActions = () => useAppStore((state) => ({
  addToWishlist: state.addToWishlist,
  removeFromWishlist: state.removeFromWishlist,
}))

export const useToastActions = () => useAppStore((state) => ({
  addToast: state.addToast,
  removeToast: state.removeToast,
}))

export const useSearchActions = () => useAppStore((state) => ({
  setSearchQuery: state.setSearchQuery,
  setSearchFilters: state.setSearchFilters,
}))

export const useLoadingActions = () => useAppStore((state) => ({
  setLoading: state.setLoading,
}))

// Computed selectors
export const useIsInWishlist = (productId: string) => 
  useAppStore((state) => state.wishlist.includes(productId))

export const useCartItemQuantity = (productId: string, color?: string, size?: string) =>
  useAppStore((state) => {
    const item = state.cart.items.find(
      (item) =>
        item.productId === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
    )
    return item?.quantity || 0
  })

export const useHasItemsInCart = () => useAppStore((state) => state.cart.items.length > 0)

export const useCartSubtotal = () => useAppStore((state) => state.cart.subtotal)
export const useCartTax = () => useAppStore((state) => state.cart.tax)
export const useCartShipping = () => useAppStore((state) => state.cart.shipping)
export const useCartDiscount = () => useAppStore((state) => state.cart.discount)

// Theme helpers
export const useThemeActions = () => useAppStore((state) => ({
  setTheme: state.setTheme,
}))

export const useIsDarkMode = () => {
  const theme = useTheme()
  
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }
  
  return theme === 'dark'
}

// User helpers
export const useUserActions = () => useAppStore((state) => ({
  setUser: state.setUser,
}))

export const useIsAuthenticated = () => useAppStore((state) => !!state.user)

export const useUserProfile = () => useAppStore((state) => {
  if (!state.user) return null
  
  return {
    id: state.user.id,
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    fullName: `${state.user.firstName} ${state.user.lastName}`,
    avatar: state.user.avatar,
    phone: state.user.phone,
  }
})

// Search helpers
export const useActiveFiltersCount = () => useAppStore((state) => {
  const filters = state.searchFilters
  let count = 0
  
  if (filters.category) count++
  if (filters.subcategory) count++
  if (filters.brand) count++
  if (filters.minPrice !== undefined) count++
  if (filters.maxPrice !== undefined) count++
  if (filters.rating !== undefined) count++
  if (filters.colors && filters.colors.length > 0) count++
  if (filters.sizes && filters.sizes.length > 0) count++
  if (filters.materials && filters.materials.length > 0) count++
  if (filters.tags && filters.tags.length > 0) count++
  if (filters.inStock !== undefined) count++
  
  return count
})

export const useClearFilters = () => useAppStore((state) => () => {
  state.setSearchFilters({
    ...initialSearchFilters,
    query: state.searchFilters.query, // Keep the search query
  })
})

// Toast helpers
export const useShowToast = () => {
  const { addToast } = useToastActions()
  
  return {
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
  }
}