// Product Types
export interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  sku: string
  category: string
  subcategory?: string
  brand?: string
  images: ProductImage[]
  priceTiers: PriceTier[]
  basePrice: number
  discountedPrice?: number
  unit: string
  stock: number
  minOrderQuantity?: number
  maxOrderQuantity?: number
  tags: string[]
  specifications: ProductSpecification[]
  rating: ProductRating
  reviews: ProductReview[]
  isActive: boolean
  isFeatured: boolean
  isNew?: boolean
  weight?: number
  dimensions?: ProductDimensions
  colors?: ProductColor[]
  sizes?: ProductSize[]
  materials?: string[]
  careInstructions?: string[]
  warranty?: string
  returnPolicy?: string
  shippingInfo?: ShippingInfo
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
  color?: string
  angle?: string
}

export interface PriceTier {
  minQuantity: number
  maxQuantity?: number
  price: number
  discountPercentage?: number
}

export interface ProductSpecification {
  name: string
  value: string
  unit?: string
  category?: string
}

export interface ProductRating {
  average: number
  count: number
  distribution: RatingDistribution
}

export interface RatingDistribution {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  images?: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in' | 'm'
}

export interface ProductColor {
  name: string
  code: string
  image?: string
}

export interface ProductSize {
  name: string
  code: string
  measurements?: Record<string, number>
}

export interface ShippingInfo {
  weight: number
  dimensions: ProductDimensions
  shippingClass: string
  freeShippingThreshold?: number
  estimatedDelivery: string
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
  pricePerUnit: number
  totalPrice: number
  addedAt: Date
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  updatedAt: Date
}

// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  addresses: Address[]
  preferences: UserPreferences
  wishlist: string[]
  orderHistory: string[]
  loyaltyPoints?: number
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  notifications: NotificationPreferences
  privacy: PrivacyPreferences
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
  orderUpdates: boolean
  priceAlerts: boolean
}

export interface PrivacyPreferences {
  showProfile: boolean
  showPurchaseHistory: boolean
  allowDataCollection: boolean
  allowPersonalization: boolean
}

// Order Types
export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: Address
  billingAddress: Address
  shippingMethod: ShippingMethod
  trackingNumber?: string
  estimatedDelivery?: Date
  actualDelivery?: Date
  notes?: string
  couponCode?: string
  refunds?: Refund[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  sku: string
  quantity: number
  pricePerUnit: number
  totalPrice: number
  selectedColor?: string
  selectedSize?: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'returned'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export interface PaymentMethod {
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod'
  provider?: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  trackingAvailable: boolean
}

export interface Refund {
  id: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  requestedAt: Date
  processedAt?: Date
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parentId?: string
  children?: Category[]
  productCount: number
  isActive: boolean
  order: number
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

// Search & Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  subcategory?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  colors?: string[]
  sizes?: string[]
  materials?: string[]
  tags?: string[]
  sortBy?: SortOption
  page?: number
  limit?: number
}

export type SortOption = 
  | 'relevance'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating'
  | 'newest'
  | 'popularity'
  | 'name-a-z'
  | 'name-z-a'

export interface SearchResult {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: AvailableFilters
}

export interface AvailableFilters {
  categories: FilterOption[]
  brands: FilterOption[]
  priceRange: { min: number; max: number }
  colors: FilterOption[]
  sizes: FilterOption[]
  materials: FilterOption[]
  ratings: FilterOption[]
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

// Wishlist Types
export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: Date
}

export interface Wishlist {
  id: string
  userId: string
  items: WishlistItem[]
  updatedAt: Date
}

// Coupon Types
export interface Coupon {
  id: string
  code: string
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'free-shipping'
  value: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usageCount: number
  userLimit?: number
  validFrom: Date
  validTo: Date
  isActive: boolean
  applicableCategories?: string[]
  applicableProducts?: string[]
  excludedCategories?: string[]
  excludedProducts?: string[]
}

// Newsletter Types
export interface NewsletterSubscription {
  id: string
  email: string
  firstName?: string
  lastName?: string
  preferences: string[]
  isActive: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
}

// Analytics Types
export interface ProductAnalytics {
  productId: string
  views: number
  clicks: number
  addToCart: number
  purchases: number
  revenue: number
  conversionRate: number
  period: 'day' | 'week' | 'month' | 'year'
  date: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Form Types
export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface CheckoutForm {
  email: string
  shippingAddress: Omit<Address, 'id' | 'isDefault'>
  billingAddress: Omit<Address, 'id' | 'isDefault'>
  useSameAddress: boolean
  shippingMethod: string
  paymentMethod: PaymentMethod
  notes?: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export interface ReviewForm {
  rating: number
  title: string
  comment: string
  images?: File[]
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
}

// Toast Types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    input: string
    ring: string
    destructive: string
    warning: string
    success: string
  }
  fonts: {
    sans: string[]
    serif: string[]
    mono: string[]
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Store Types (Zustand)
export interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Cart
  cart: Cart
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void
  removeFromCart: (itemId: string) => void
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  
  // Wishlist
  wishlist: string[]
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchFilters: SearchFilters
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  
  // UI State
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
  
  // Toasts
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  
  // Loading states
  isLoading: Record<string, boolean>
  setLoading: (key: string, loading: boolean) => void
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Event Types
export interface ProductViewEvent {
  productId: string
  productName: string
  category: string
  price: number
  timestamp: Date
}

export interface AddToCartEvent {
  productId: string
  productName: string
  category: string
  price: number
  quantity: number
  timestamp: Date
}

export interface PurchaseEvent {
  orderId: string
  products: {
    productId: string
    productName: string
    category: string
    price: number
    quantity: number
  }[]
  total: number
  timestamp: Date
}

// SEO Types
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  siteName?: string
  locale?: string
  alternateLocales?: string[]
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Feature Flag Types
export interface FeatureFlags {
  enableWishlist: boolean
  enableReviews: boolean
  enableCoupons: boolean
  enableLoyaltyProgram: boolean
  enableSocialLogin: boolean
  enableGuestCheckout: boolean
  enableMultiCurrency: boolean
  enableInventoryTracking: boolean
  enableProductComparison: boolean
  enableAdvancedSearch: boolean
}