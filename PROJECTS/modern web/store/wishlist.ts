import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Wishlist, WishlistItem, Product } from '@/types'
import { generateId } from '@/lib/utils'
import toast from 'react-hot-toast'

interface WishlistStore {
  wishlist: Wishlist | null
  
  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  toggleItem: (product: Product) => void
  
  // Getters
  isInWishlist: (productId: string) => boolean
  getTotalItems: () => number
  getWishlistItems: () => WishlistItem[]
}

const createInitialWishlist = (): Wishlist => ({
  id: generateId(),
  userId: '', // Will be set when user logs in
  items: [],
  totalItems: 0,
  updatedAt: new Date().toISOString(),
})

export const useWishlistStore = create<WishlistStore>()()
  persist(
    (set, get) => ({
      wishlist: null,
      
      addItem: (product: Product) => {
        const state = get()
        
        // Initialize wishlist if it doesn't exist
        if (!state.wishlist) {
          const newWishlist = createInitialWishlist()
          set({ wishlist: newWishlist })
        }
        
        const currentWishlist = get().wishlist!
        
        // Check if item already exists
        const existingItem = currentWishlist.items.find(
          item => item.productId === product.id
        )
        
        if (existingItem) {
          toast.error(`${product.name} is already in your wishlist`)
          return
        }
        
        const newItem: WishlistItem = {
          id: generateId(),
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        }
        
        const updatedItems = [...currentWishlist.items, newItem]
        
        set({
          wishlist: {
            ...currentWishlist,
            items: updatedItems,
            totalItems: updatedItems.length,
            updatedAt: new Date().toISOString(),
          },
        })
        
        toast.success(`${product.name} added to wishlist`)
      },
      
      removeItem: (productId: string) => {
        const state = get()
        
        if (!state.wishlist) return
        
        const updatedItems = state.wishlist.items.filter(
          item => item.productId !== productId
        )
        
        const removedItem = state.wishlist.items.find(
          item => item.productId === productId
        )
        
        set({
          wishlist: {
            ...state.wishlist,
            items: updatedItems,
            totalItems: updatedItems.length,
            updatedAt: new Date().toISOString(),
          },
        })
        
        if (removedItem) {
          toast.success(`${removedItem.product.name} removed from wishlist`)
        }
      },
      
      clearWishlist: () => {
        const state = get()
        
        if (!state.wishlist) return
        
        set({
          wishlist: {
            ...state.wishlist,
            items: [],
            totalItems: 0,
            updatedAt: new Date().toISOString(),
          },
        })
        
        toast.success('Wishlist cleared')
      },
      
      toggleItem: (product: Product) => {
        const state = get()
        
        if (!state.wishlist) {
          // If no wishlist exists, create one and add the item
          get().addItem(product)
          return
        }
        
        const isInWishlist = state.wishlist.items.some(
          item => item.productId === product.id
        )
        
        if (isInWishlist) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },
      
      isInWishlist: (productId: string) => {
        const state = get()
        
        if (!state.wishlist) return false
        
        return state.wishlist.items.some(item => item.productId === productId)
      },
      
      getTotalItems: () => {
        const state = get()
        return state.wishlist?.totalItems || 0
      },
      
      getWishlistItems: () => {
        const state = get()
        return state.wishlist?.items || []
      },
    }),
    {
      name: 'shubham-enterprises-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ wishlist: state.wishlist }),
    }
  )
)

// Selectors for better performance
export const useWishlistItems = () => useWishlistStore(state => state.wishlist?.items || [])
export const useWishlistCount = () => useWishlistStore(state => state.wishlist?.totalItems || 0)
export const useIsInWishlist = (productId: string) => 
  useWishlistStore(state => state.isInWishlist(productId))