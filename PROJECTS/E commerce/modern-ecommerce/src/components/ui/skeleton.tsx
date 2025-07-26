import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        shimmer: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
        wave: "bg-muted animate-wave",
        pulse: "bg-muted animate-pulse",
        glow: "bg-muted animate-glow",
      },
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
        xl: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Skeleton({
  className,
  variant,
  size,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Product Card Skeleton
interface ProductCardSkeletonProps {
  variant?: "default" | "compact" | "detailed"
  className?: string
}

function ProductCardSkeleton({ variant = "default", className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-4", className)}>
      {/* Image */}
      <Skeleton 
        variant="shimmer" 
        className={cn(
          "w-full rounded-md",
          variant === "compact" ? "h-40" : "h-48 md:h-56"
        )} 
      />
      
      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton variant="shimmer" className="h-4 w-3/4" />
          <Skeleton variant="shimmer" className="h-4 w-1/2" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="shimmer" className="h-3 w-3 rounded-full" />
            ))}
          </div>
          <Skeleton variant="shimmer" className="h-3 w-12" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton variant="shimmer" className="h-6 w-20" />
          <Skeleton variant="shimmer" className="h-4 w-16" />
        </div>
      </div>
      
      {/* Button */}
      {variant !== "compact" && (
        <Skeleton variant="shimmer" className="h-10 w-full rounded-md" />
      )}
    </div>
  )
}

// Product Grid Skeleton
interface ProductGridSkeletonProps {
  count?: number
  variant?: "default" | "compact" | "detailed"
  className?: string
}

function ProductGridSkeleton({ count = 8, variant = "default", className }: ProductGridSkeletonProps) {
  return (
    <div className={cn(
      "grid gap-6",
      variant === "compact" 
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      className
    )}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  )
}

// Product Detail Skeleton
function ProductDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8", className)}>
      {/* Images */}
      <div className="space-y-4">
        <Skeleton variant="shimmer" className="aspect-square w-full rounded-lg" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="shimmer" className="w-16 h-16 rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-6">
        {/* Title and Price */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton variant="shimmer" className="h-8 w-3/4" />
            <Skeleton variant="shimmer" className="h-6 w-1/2" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton variant="shimmer" className="h-8 w-24" />
            <Skeleton variant="shimmer" className="h-6 w-20" />
            <Skeleton variant="shimmer" className="h-6 w-16 rounded-full" />
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="shimmer" className="h-4 w-4" />
            ))}
          </div>
          <Skeleton variant="shimmer" className="h-4 w-20" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton variant="shimmer" className="h-4 w-full" />
          <Skeleton variant="shimmer" className="h-4 w-full" />
          <Skeleton variant="shimmer" className="h-4 w-3/4" />
        </div>
        
        {/* Variants */}
        <div className="space-y-3">
          <Skeleton variant="shimmer" className="h-5 w-16" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="shimmer" className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Quantity */}
        <div className="space-y-3">
          <Skeleton variant="shimmer" className="h-5 w-20" />
          <Skeleton variant="shimmer" className="h-10 w-32 rounded-md" />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <Skeleton variant="shimmer" className="h-12 flex-1 rounded-md" />
          <Skeleton variant="shimmer" className="h-12 w-12 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Cart Item Skeleton
function CartItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 p-4 border rounded-lg", className)}>
      <Skeleton variant="shimmer" className="w-16 h-16 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="shimmer" className="h-4 w-3/4" />
        <Skeleton variant="shimmer" className="h-3 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton variant="shimmer" className="h-6 w-20" />
          <Skeleton variant="shimmer" className="h-6 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="shimmer" className="h-8 w-24 rounded-md" />
        <Skeleton variant="shimmer" className="h-6 w-16" />
      </div>
    </div>
  )
}

// Cart Skeleton
function CartSkeleton({ itemCount = 3, className }: { itemCount?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(itemCount)].map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
      
      {/* Summary */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton variant="shimmer" className="h-4 w-16" />
          <Skeleton variant="shimmer" className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="shimmer" className="h-4 w-20" />
          <Skeleton variant="shimmer" className="h-4 w-16" />
        </div>
        <div className="flex justify-between border-t pt-2">
          <Skeleton variant="shimmer" className="h-6 w-16" />
          <Skeleton variant="shimmer" className="h-6 w-24" />
        </div>
        <Skeleton variant="shimmer" className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}

// Review Skeleton
function ReviewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 p-4 border rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton variant="shimmer" className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton variant="shimmer" className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="shimmer" className="h-3 w-3" />
              ))}
            </div>
            <Skeleton variant="shimmer" className="h-3 w-16" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="shimmer" className="h-4 w-full" />
        <Skeleton variant="shimmer" className="h-4 w-full" />
        <Skeleton variant="shimmer" className="h-4 w-2/3" />
      </div>
      
      {/* Images */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="shimmer" className="w-16 h-16 rounded-md" />
        ))}
      </div>
    </div>
  )
}

// Reviews List Skeleton
function ReviewsListSkeleton({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(count)].map((_, i) => (
        <ReviewSkeleton key={i} />
      ))}
    </div>
  )
}

// Category Card Skeleton
function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
      <Skeleton variant="shimmer" className="aspect-square w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton variant="shimmer" className="h-5 w-3/4" />
        <Skeleton variant="shimmer" className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Category Grid Skeleton
function CategoryGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4", className)}>
      {[...Array(count)].map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Order Item Skeleton
function OrderItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-4 space-y-4", className)}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Skeleton variant="shimmer" className="h-5 w-32" />
          <Skeleton variant="shimmer" className="h-4 w-24" />
        </div>
        <Skeleton variant="shimmer" className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Items */}
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton variant="shimmer" className="w-12 h-12 rounded-md" />
            <div className="flex-1 space-y-1">
              <Skeleton variant="shimmer" className="h-4 w-3/4" />
              <Skeleton variant="shimmer" className="h-3 w-1/2" />
            </div>
            <Skeleton variant="shimmer" className="h-4 w-16" />
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-3">
        <Skeleton variant="shimmer" className="h-5 w-20" />
        <Skeleton variant="shimmer" className="h-8 w-24 rounded-md" />
      </div>
    </div>
  )
}

// Orders List Skeleton
function OrdersListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(count)].map((_, i) => (
        <OrderItemSkeleton key={i} />
      ))}
    </div>
  )
}

// Table Skeleton
interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}

function TableSkeleton({ rows = 5, columns = 4, showHeader = true, className }: TableSkeletonProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {showHeader && (
        <div className="border-b bg-muted/50 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} variant="shimmer" className="h-4 w-20" />
            ))}
          </div>
        </div>
      )}
      <div className="divide-y">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} variant="shimmer" className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Page Skeleton
function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="space-y-4">
        <Skeleton variant="shimmer" className="h-8 w-64" />
        <Skeleton variant="shimmer" className="h-4 w-96" />
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton variant="shimmer" className="h-6 w-24" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="shimmer" className="h-4 w-full" />
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailSkeleton,
  CartItemSkeleton,
  CartSkeleton,
  ReviewSkeleton,
  ReviewsListSkeleton,
  CategoryCardSkeleton,
  CategoryGridSkeleton,
  OrderItemSkeleton,
  OrdersListSkeleton,
  TableSkeleton,
  PageSkeleton,
  skeletonVariants,
}