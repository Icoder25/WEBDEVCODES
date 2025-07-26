// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'customer' | 'reseller' | 'admin'
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Product Types
export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface TierPrice {
  minQuantity: number
  maxQuantity?: number
  price: number
  discountPercentage?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  category: Category
  subcategory?: Subcategory
  brand: string
  images: ProductImage[]
  basePrice: number
  tierPrices: TierPrice[]
  moq: number // Minimum Order Quantity
  stock: number
  isActive: boolean
  isFeatured: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Subcategory extends Omit<Category, 'parentId'> {
  categoryId: string
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selectedTierPrice: TierPrice
  totalPrice: number
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  subtotal: number
  tax: number
  discount: number
  shippingCost: number
}

// Order Types
export interface ShippingAddress {
  id?: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault?: boolean
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
  tierPrice: TierPrice
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user: User
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'upi' | 'credit' | 'bank_transfer' | 'cod'
  subtotal: number
  tax: number
  discount: number
  shippingCost: number
  totalAmount: number
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

// Reseller Types
export interface ResellerApplication {
  id: string
  userId: string
  businessName: string
  businessType: 'retail' | 'online' | 'distributor' | 'other'
  gstNumber?: string
  businessAddress: ShippingAddress
  expectedMonthlyVolume: number
  experience: string
  status: 'pending' | 'approved' | 'rejected'
  documents: {
    businessLicense?: string
    gstCertificate?: string
    addressProof?: string
  }
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface ResellerProfile {
  id: string
  userId: string
  businessName: string
  gstNumber?: string
  creditLimit: number
  usedCredit: number
  availableCredit: number
  marginPercentage: number
  isActive: boolean
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  totalOrders: number
  totalVolume: number
  joinedAt: string
}

// Wishlist Types
export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

export interface Wishlist {
  id: string
  userId: string
  items: WishlistItem[]
  totalItems: number
  updatedAt: string
}

// Filter and Search Types
export interface ProductFilters {
  category?: string[]
  subcategory?: string[]
  brand?: string[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  featured?: boolean
  tags?: string[]
  sortBy?: 'name' | 'price_low' | 'price_high' | 'newest' | 'popular'
  search?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ProductSearchResult {
  products: Product[]
  meta: PaginationMeta
  filters: {
    categories: Category[]
    brands: string[]
    priceRange: {
      min: number
      max: number
    }
  }
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'order' | 'payment' | 'product' | 'promotion' | 'system'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

// Analytics Types
export interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
  recentOrders: Order[]
  topProducts: (Product & { orderCount: number })[]
  salesChart: {
    date: string
    sales: number
    orders: number
  }[]
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: PaginationMeta
}

// Form Types
export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface NewsletterForm {
  email: string
}

export interface ResellerSignupForm {
  name: string
  email: string
  phone: string
  businessName: string
  businessType: 'retail' | 'online' | 'distributor' | 'other'
  gstNumber?: string
  businessAddress: Omit<ShippingAddress, 'id' | 'isDefault'>
  expectedMonthlyVolume: number
  experience: string
}

// Store Types (Zustand)
export interface CartStore {
  cart: Cart
  addItem: (product: Product, quantity: number, tierPrice: TierPrice) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalAmount: () => number
}

export interface WishlistStore {
  wishlist: Wishlist | null
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User>) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

// Component Props Types
export interface ProductCardProps {
  product: Product
  showQuickView?: boolean
  showWishlist?: boolean
  className?: string
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type NonEmptyArray<T> = [T, ...T[]]