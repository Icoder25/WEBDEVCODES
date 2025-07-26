import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Cart, CartItem, Product, TierPrice } from '@/types'
import { generateId } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CartStore {
  cart: Cart
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, quantity: number, tierPrice: TierPrice) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Getters
  getTotalItems: () => number
  getTotalAmount: () => number
  getItemCount: (productId: string) => number
  isInCart: (productId: string) => boolean
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  subtotal: 0,
  tax: 0,
  discount: 0,
  shippingCost: 0,
}

const TAX_RATE = 0.18 // 18% GST
const FREE_SHIPPING_THRESHOLD = 5000
const SHIPPING_COST = 200

const calculateCartTotals = (items: CartItem[]): Omit<Cart, 'items'> => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = subtotal * TAX_RATE
  const discount = 0 // Can be implemented later
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const totalAmount = subtotal + tax + shippingCost - discount
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  return {
    totalItems,
    totalAmount,
    subtotal,
    tax,
    discount,
    shippingCost,
  }
}

const findBestTierPrice = (product: Product, quantity: number): TierPrice => {
  // Sort tier prices by minimum quantity in descending order
  const sortedTiers = [...product.tierPrices].sort((a, b) => b.minQuantity - a.minQuantity)
  
  // Find the best tier price for the given quantity
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQuantity) {
      if (!tier.maxQuantity || quantity <= tier.maxQuantity) {
        return tier
      }
    }
  }
  
  // Fallback to the lowest tier or base price
  return product.tierPrices[0] || {
    minQuantity: 1,
    price: product.basePrice,
  }
}

export const useCartStore = create<CartStore>()()
  persist(
    (set, get) => ({
      cart: initialCart,
      isOpen: false,
      
      addItem: (product: Product, quantity: number, tierPrice?: TierPrice) => {
        const state = get()
        const existingItemIndex = state.cart.items.findIndex(
          item => item.productId === product.id
        )
        
        // Check if quantity meets MOQ
        if (quantity < product.moq) {
          toast.error(`Minimum order quantity is ${product.moq} for ${product.name}`)
          return
        }
        
        // Check stock availability
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`)
          return
        }
        
        let newItems: CartItem[]
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const existingItem = state.cart.items[existingItemIndex]
          const newQuantity = existingItem.quantity + quantity
          
          // Check stock for updated quantity
          if (newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`)
            return
          }
          
          const bestTierPrice = tierPrice || findBestTierPrice(product, newQuantity)
          const updatedItem: CartItem = {
            ...existingItem,
            quantity: newQuantity,
            selectedTierPrice: bestTierPrice,
            totalPrice: newQuantity * bestTierPrice.price,
          }
          
          newItems = [...state.cart.items]
          newItems[existingItemIndex] = updatedItem
        } else {
          // Add new item
          const bestTierPrice = tierPrice || findBestTierPrice(product, quantity)
          const newItem: CartItem = {
            id: generateId(),
            productId: product.id,
            product,
            quantity,
            selectedTierPrice: bestTierPrice,
            totalPrice: quantity * bestTierPrice.price,
            addedAt: new Date().toISOString(),
          }
          
          newItems = [...state.cart.items, newItem]
        }
        
        const cartTotals = calculateCartTotals(newItems)
        
        set({
          cart: {
            items: newItems,
            ...cartTotals,
          },
        })
        
        toast.success(`${product.name} added to cart`)
      },
      
      removeItem: (itemId: string) => {
        const state = get()
        const newItems = state.cart.items.filter(item => item.id !== itemId)
        const cartTotals = calculateCartTotals(newItems)
        
        set({
          cart: {
            items: newItems,
            ...cartTotals,
          },
        })
        
        toast.success('Item removed from cart')
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        const state = get()
        const itemIndex = state.cart.items.findIndex(item => item.id === itemId)
        
        if (itemIndex === -1) return
        
        const item = state.cart.items[itemIndex]
        
        // Check MOQ
        if (quantity < item.product.moq) {
          toast.error(`Minimum order quantity is ${item.product.moq}`)
          return
        }
        
        // Check stock
        if (quantity > item.product.stock) {
          toast.error(`Only ${item.product.stock} items available`)
          return
        }
        
        const bestTierPrice = findBestTierPrice(item.product, quantity)
        const updatedItem: CartItem = {
          ...item,
          quantity,
          selectedTierPrice: bestTierPrice,
          totalPrice: quantity * bestTierPrice.price,
        }
        
        const newItems = [...state.cart.items]
        newItems[itemIndex] = updatedItem
        
        const cartTotals = calculateCartTotals(newItems)
        
        set({
          cart: {
            items: newItems,
            ...cartTotals,
          },
        })
      },
      
      clearCart: () => {
        set({ cart: initialCart })
        toast.success('Cart cleared')
      },
      
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },
      
      openCart: () => {
        set({ isOpen: true })
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      getTotalItems: () => {
        return get().cart.totalItems
      },
      
      getTotalAmount: () => {
        return get().cart.totalAmount
      },
      
      getItemCount: (productId: string) => {
        const item = get().cart.items.find(item => item.productId === productId)
        return item ? item.quantity : 0
      },
      
      isInCart: (productId: string) => {
        return get().cart.items.some(item => item.productId === productId)
      },
    }),
    {
      name: 'shubham-enterprises-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)

// Selectors for better performance
export const useCartItems = () => useCartStore(state => state.cart.items)
export const useCartTotal = () => useCartStore(state => state.cart.totalAmount)
export const useCartCount = () => useCartStore(state => state.cart.totalItems)
export const useCartOpen = () => useCartStore(state => state.isOpen)