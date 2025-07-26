import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'
import toast from 'react-hot-toast'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  
  // Getters
  isAdmin: () => boolean
  isReseller: () => boolean
  isCustomer: () => boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'customer' | 'reseller'
}

// Mock API functions - Replace with actual API calls
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (email === 'admin@shubham.com' && password === 'admin123') {
    return {
      id: '1',
      email: 'admin@shubham.com',
      name: 'Admin User',
      phone: '+91 9876543210',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  }
  
  if (email === 'reseller@example.com' && password === 'reseller123') {
    return {
      id: '2',
      email: 'reseller@example.com',
      name: 'Reseller User',
      phone: '+91 9876543211',
      role: 'reseller',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  }
  
  if (email === 'customer@example.com' && password === 'customer123') {
    return {
      id: '3',
      email: 'customer@example.com',
      name: 'Customer User',
      phone: '+91 9876543212',
      role: 'customer',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  }
  
  throw new Error('Invalid email or password')
}

const mockRegister = async (userData: RegisterData): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock user creation
  return {
    id: Math.random().toString(36).substr(2, 9),
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    role: userData.role || 'customer',
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

const mockUpdateProfile = async (userData: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return updated user data
  return {
    ...userData,
    updatedAt: new Date().toISOString(),
  } as User
}

export const useAuthStore = create<AuthStore>()()
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const user = await mockLogin(email, password)
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          
          toast.success(`Welcome back, ${user.name}!`)
        } catch (error) {
          set({ isLoading: false })
          toast.error(error instanceof Error ? error.message : 'Login failed')
          throw error
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
        
        // Clear other stores if needed
        localStorage.removeItem('shubham-enterprises-cart')
        localStorage.removeItem('shubham-enterprises-wishlist')
        
        toast.success('Logged out successfully')
      },
      
      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true })
          
          const user = await mockRegister(userData)
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          
          toast.success(`Welcome to Shubham Enterprises, ${user.name}!`)
        } catch (error) {
          set({ isLoading: false })
          toast.error(error instanceof Error ? error.message : 'Registration failed')
          throw error
        }
      },
      
      updateProfile: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true })
          
          const currentUser = get().user
          if (!currentUser) {
            throw new Error('No user logged in')
          }
          
          const updatedUser = await mockUpdateProfile({
            ...currentUser,
            ...userData,
          })
          
          set({
            user: updatedUser,
            isLoading: false,
          })
          
          toast.success('Profile updated successfully')
        } catch (error) {
          set({ isLoading: false })
          toast.error(error instanceof Error ? error.message : 'Profile update failed')
          throw error
        }
      },
      
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      isAdmin: () => {
        const user = get().user
        return user?.role === 'admin'
      },
      
      isReseller: () => {
        const user = get().user
        return user?.role === 'reseller'
      },
      
      isCustomer: () => {
        const user = get().user
        return user?.role === 'customer'
      },
    }),
    {
      name: 'shubham-enterprises-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selectors for better performance
export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore(state => state.isLoading)
export const useUserRole = () => useAuthStore(state => state.user?.role)
export const useIsAdmin = () => useAuthStore(state => state.isAdmin())
export const useIsReseller = () => useAuthStore(state => state.isReseller())
export const useIsCustomer = () => useAuthStore(state => state.isCustomer())