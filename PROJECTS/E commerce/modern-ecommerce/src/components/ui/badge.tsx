import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        gradient:
          "border-transparent bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90",
        glass:
          "border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
        neumorphism:
          "border-transparent bg-background text-foreground shadow-neumorphism hover:shadow-neumorphism-hover",
        glow:
          "border-primary/20 bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        ping: "animate-ping",
        spin: "animate-spin",
        wiggle: "animate-wiggle",
        float: "animate-float",
        glow: "animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, size, animation, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, animation }), className)}
      {...props}
    />
  )
}

// Status Badge Component
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'active' | 'inactive'
  showDot?: boolean
  dotPosition?: 'left' | 'right'
}

const statusConfig = {
  online: { variant: 'success' as const, label: 'Online', color: 'bg-green-500' },
  offline: { variant: 'secondary' as const, label: 'Offline', color: 'bg-gray-500' },
  away: { variant: 'warning' as const, label: 'Away', color: 'bg-yellow-500' },
  busy: { variant: 'destructive' as const, label: 'Busy', color: 'bg-red-500' },
  pending: { variant: 'info' as const, label: 'Pending', color: 'bg-blue-500' },
  active: { variant: 'success' as const, label: 'Active', color: 'bg-green-500' },
  inactive: { variant: 'secondary' as const, label: 'Inactive', color: 'bg-gray-500' },
}

function StatusBadge({ 
  status, 
  showDot = false, 
  dotPosition = 'left', 
  className, 
  children,
  ...props 
}: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge
      variant={config.variant}
      className={cn("gap-1.5", className)}
      {...props}
    >
      {showDot && dotPosition === 'left' && (
        <div className={cn("w-2 h-2 rounded-full", config.color)} />
      )}
      {children || config.label}
      {showDot && dotPosition === 'right' && (
        <div className={cn("w-2 h-2 rounded-full", config.color)} />
      )}
    </Badge>
  )
}

// Notification Badge Component
export interface NotificationBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number
  max?: number
  showZero?: boolean
  dot?: boolean
}

function NotificationBadge({ 
  count, 
  max = 99, 
  showZero = false, 
  dot = false,
  className,
  ...props 
}: NotificationBadgeProps) {
  if (!showZero && count === 0) return null
  
  const displayCount = count > max ? `${max}+` : count.toString()
  
  if (dot) {
    return (
      <Badge
        variant="destructive"
        className={cn("w-2 h-2 p-0 rounded-full", className)}
        {...props}
      />
    )
  }
  
  return (
    <Badge
      variant="destructive"
      size="sm"
      className={cn("min-w-[1.25rem] h-5 px-1 justify-center", className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

// Category Badge Component
export interface CategoryBadgeProps extends Omit<BadgeProps, 'variant'> {
  category: string
  color?: string
  icon?: React.ReactNode
}

function CategoryBadge({ 
  category, 
  color, 
  icon, 
  className, 
  ...props 
}: CategoryBadgeProps) {
  const categoryColors: Record<string, string> = {
    electronics: "bg-blue-500 text-white",
    clothing: "bg-purple-500 text-white",
    books: "bg-green-500 text-white",
    home: "bg-orange-500 text-white",
    sports: "bg-red-500 text-white",
    beauty: "bg-pink-500 text-white",
    toys: "bg-yellow-500 text-black",
    automotive: "bg-gray-700 text-white",
    food: "bg-emerald-500 text-white",
    health: "bg-teal-500 text-white",
  }
  
  const categoryColor = color || categoryColors[category.toLowerCase()] || "bg-gray-500 text-white"
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent gap-1.5",
        categoryColor,
        className
      )}
      {...props}
    >
      {icon}
      {category}
    </Badge>
  )
}

// Price Badge Component
export interface PriceBadgeProps extends Omit<BadgeProps, 'children'> {
  price: number
  originalPrice?: number
  currency?: string
  showDiscount?: boolean
}

function PriceBadge({ 
  price, 
  originalPrice, 
  currency = "₹", 
  showDiscount = true,
  className,
  ...props 
}: PriceBadgeProps) {
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0
  
  if (hasDiscount && showDiscount) {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="destructive"
          size="sm"
          className={cn("font-bold", className)}
          {...props}
        >
          -{discountPercentage}% OFF
        </Badge>
        <div className="flex items-center gap-1">
          <span className="font-bold text-lg">
            {currency}{price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {currency}{originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    )
  }
  
  return (
    <Badge
      variant="outline"
      size="lg"
      className={cn("font-bold text-lg", className)}
      {...props}
    >
      {currency}{price.toLocaleString()}
    </Badge>
  )
}

// Rating Badge Component
export interface RatingBadgeProps extends Omit<BadgeProps, 'children'> {
  rating: number
  maxRating?: number
  showStars?: boolean
  reviewCount?: number
}

function RatingBadge({ 
  rating, 
  maxRating = 5, 
  showStars = true, 
  reviewCount,
  className,
  ...props 
}: RatingBadgeProps) {
  const stars = Math.round(rating)
  
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 bg-yellow-50 border-yellow-200 text-yellow-800", className)}
      {...props}
    >
      {showStars && (
        <div className="flex items-center">
          {[...Array(maxRating)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                "w-3 h-3",
                i < stars ? "text-yellow-400 fill-current" : "text-gray-300"
              )}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      <span className="font-medium">{rating.toFixed(1)}</span>
      {reviewCount && (
        <span className="text-xs opacity-75">({reviewCount})</span>
      )}
    </Badge>
  )
}

// Stock Badge Component
export interface StockBadgeProps extends Omit<BadgeProps, 'children' | 'variant'> {
  stock: number
  lowStockThreshold?: number
  outOfStockThreshold?: number
}

function StockBadge({ 
  stock, 
  lowStockThreshold = 10, 
  outOfStockThreshold = 0,
  className,
  ...props 
}: StockBadgeProps) {
  const getStockStatus = () => {
    if (stock <= outOfStockThreshold) {
      return { variant: 'destructive' as const, label: 'Out of Stock', animation: 'pulse' as const }
    }
    if (stock <= lowStockThreshold) {
      return { variant: 'warning' as const, label: `Only ${stock} left`, animation: 'none' as const }
    }
    return { variant: 'success' as const, label: 'In Stock', animation: 'none' as const }
  }
  
  const status = getStockStatus()
  
  return (
    <Badge
      variant={status.variant}
      animation={status.animation}
      className={cn("font-medium", className)}
      {...props}
    >
      {status.label}
    </Badge>
  )
}

// Shipping Badge Component
export interface ShippingBadgeProps extends Omit<BadgeProps, 'children' | 'variant'> {
  type: 'free' | 'fast' | 'express' | 'standard' | 'overnight'
  estimatedDays?: number
}

function ShippingBadge({ 
  type, 
  estimatedDays,
  className,
  ...props 
}: ShippingBadgeProps) {
  const shippingConfig = {
    free: { variant: 'success' as const, label: 'Free Shipping', icon: '🚚' },
    fast: { variant: 'info' as const, label: 'Fast Shipping', icon: '⚡' },
    express: { variant: 'warning' as const, label: 'Express', icon: '🚀' },
    standard: { variant: 'secondary' as const, label: 'Standard', icon: '📦' },
    overnight: { variant: 'gradient' as const, label: 'Overnight', icon: '🌙' },
  }
  
  const config = shippingConfig[type]
  
  return (
    <Badge
      variant={config.variant}
      className={cn("gap-1.5 font-medium", className)}
      {...props}
    >
      <span>{config.icon}</span>
      {config.label}
      {estimatedDays && (
        <span className="text-xs opacity-75">
          ({estimatedDays} {estimatedDays === 1 ? 'day' : 'days'})
        </span>
      )}
    </Badge>
  )
}

// Feature Badge Component
export interface FeatureBadgeProps extends Omit<BadgeProps, 'children'> {
  feature: 'new' | 'hot' | 'sale' | 'limited' | 'exclusive' | 'bestseller' | 'trending'
  customLabel?: string
}

function FeatureBadge({ 
  feature, 
  customLabel,
  className,
  ...props 
}: FeatureBadgeProps) {
  const featureConfig = {
    new: { variant: 'info' as const, label: 'NEW', animation: 'glow' as const },
    hot: { variant: 'destructive' as const, label: 'HOT', animation: 'pulse' as const },
    sale: { variant: 'warning' as const, label: 'SALE', animation: 'bounce' as const },
    limited: { variant: 'gradient' as const, label: 'LIMITED', animation: 'wiggle' as const },
    exclusive: { variant: 'neumorphism' as const, label: 'EXCLUSIVE', animation: 'float' as const },
    bestseller: { variant: 'success' as const, label: 'BESTSELLER', animation: 'none' as const },
    trending: { variant: 'glow' as const, label: 'TRENDING', animation: 'glow' as const },
  }
  
  const config = featureConfig[feature]
  
  return (
    <Badge
      variant={config.variant}
      animation={config.animation}
      size="sm"
      className={cn("font-bold tracking-wide", className)}
      {...props}
    >
      {customLabel || config.label}
    </Badge>
  )
}

export { 
  Badge, 
  StatusBadge, 
  NotificationBadge, 
  CategoryBadge, 
  PriceBadge, 
  RatingBadge, 
  StockBadge, 
  ShippingBadge, 
  FeatureBadge,
  badgeVariants 
}