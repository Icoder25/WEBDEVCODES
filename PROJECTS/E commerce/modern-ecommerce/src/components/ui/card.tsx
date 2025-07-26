import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-card hover:shadow-md",
        elevated: "shadow-lg hover:shadow-xl border-0",
        outlined: "border-2 border-border bg-transparent hover:bg-card/50",
        filled: "bg-muted border-0 hover:bg-muted/80",
        glass: "bg-white/10 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/20",
        gradient: "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20",
        neumorphism: "bg-background shadow-neumorphism hover:shadow-neumorphism-hover border-0",
        glow: "bg-card border-primary/20 shadow-glow hover:shadow-glow-lg",
      },
      size: {
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      interactive: {
        none: "",
        hover: "hover:scale-[1.02] cursor-pointer",
        press: "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        float: "hover:animate-float cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, interactive, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Product Card Component
export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    rating?: number
    reviewCount?: number
    badge?: string
    isWishlisted?: boolean
  }
  onAddToCart?: () => void
  onToggleWishlist?: () => void
  onQuickView?: () => void
  variant?: "default" | "compact" | "detailed"
  showQuickActions?: boolean
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      product,
      onAddToCart,
      onToggleWishlist,
      onQuickView,
      variant = "default",
      showQuickActions = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const discountPercentage = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

    return (
      <Card
        ref={ref}
        variant="elevated"
        interactive="hover"
        className={cn("group overflow-hidden relative", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Product Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full object-cover transition-transform duration-300",
              variant === "compact" ? "h-40" : "h-48 md:h-56",
              "group-hover:scale-105"
            )}
          />
          
          {/* Quick Actions Overlay */}
          {showQuickActions && (
            <div
              className={cn(
                "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <button
                onClick={onQuickView}
                className="bg-white/90 hover:bg-white text-black p-2 rounded-full transition-colors"
                title="Quick View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={onToggleWishlist}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  product.isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/90 hover:bg-white text-black"
                )}
                title={product.isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <svg className="w-4 h-4" fill={product.isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className={cn(variant === "compact" ? "p-3" : "p-4")}>
          <div className="space-y-2">
            <h3 className={cn(
              "font-medium line-clamp-2",
              variant === "compact" ? "text-sm" : "text-base"
            )}>
              {product.name}
            </h3>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.floor(product.rating!)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                )}
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-semibold",
                variant === "compact" ? "text-sm" : "text-base"
              )}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        {variant !== "compact" && (
          <CardFooter className="p-4 pt-0">
            <button
              onClick={onAddToCart}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
          </CardFooter>
        )}
      </Card>
    )
  }
)
ProductCard.displayName = "ProductCard"

// Feature Card Component
export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description: string
  variant?: "default" | "centered" | "horizontal"
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, variant = "default", className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="elevated"
        interactive="hover"
        className={cn(
          "group",
          variant === "horizontal" && "flex items-center gap-4",
          className
        )}
        {...props}
      >
        <div className={cn(
          variant === "centered" && "text-center",
          variant === "horizontal" ? "flex-shrink-0" : "space-y-4"
        )}>
          <div className={cn(
            "inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors",
            variant === "horizontal" ? "w-12 h-12" : "w-16 h-16",
            variant === "centered" && "mx-auto"
          )}>
            {icon}
          </div>
          
          <div className={cn(variant === "horizontal" && "flex-1")}>
            <h3 className={cn(
              "font-semibold mb-2",
              variant === "horizontal" ? "text-base" : "text-lg"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-muted-foreground",
              variant === "horizontal" ? "text-sm" : "text-base"
            )}>
              {description}
            </p>
          </div>
        </div>
      </Card>
    )
  }
)
FeatureCard.displayName = "FeatureCard"

// Testimonial Card Component
export interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonial: {
    content: string
    author: string
    role?: string
    avatar?: string
    rating?: number
  }
  variant?: "default" | "minimal" | "detailed"
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ testimonial, variant = "default", className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn("relative", className)}
        {...props}
      >
        {/* Quote Icon */}
        {variant !== "minimal" && (
          <div className="absolute top-4 right-4 text-primary/20">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
            </svg>
          </div>
        )}

        <CardContent className={cn(variant === "minimal" ? "p-4" : "p-6")}>
          {/* Rating */}
          {testimonial.rating && variant !== "minimal" && (
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < testimonial.rating!
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}

          {/* Content */}
          <blockquote className={cn(
            "text-muted-foreground mb-4",
            variant === "minimal" ? "text-sm" : "text-base",
            variant === "detailed" && "text-lg leading-relaxed"
          )}>
            "{testimonial.content}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-3">
            {testimonial.avatar && (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className={cn(
                  "rounded-full object-cover",
                  variant === "minimal" ? "w-8 h-8" : "w-12 h-12"
                )}
              />
            )}
            <div>
              <div className={cn(
                "font-semibold",
                variant === "minimal" ? "text-sm" : "text-base"
              )}>
                {testimonial.author}
              </div>
              {testimonial.role && (
                <div className={cn(
                  "text-muted-foreground",
                  variant === "minimal" ? "text-xs" : "text-sm"
                )}>
                  {testimonial.role}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
TestimonialCard.displayName = "TestimonialCard"

// Stats Card Component
export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period?: string
  }
  icon?: React.ReactNode
  variant?: "default" | "compact" | "detailed"
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, change, icon, variant = "default", className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        
        <CardContent className={cn(
          "relative",
          variant === "compact" ? "p-4" : "p-6"
        )}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className={cn(
                "text-muted-foreground font-medium",
                variant === "compact" ? "text-xs" : "text-sm"
              )}>
                {title}
              </p>
              <p className={cn(
                "font-bold",
                variant === "compact" ? "text-xl" : "text-2xl md:text-3xl"
              )}>
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              
              {change && (
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                    change.type === "increase"
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  )}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={change.type === "increase" ? "M7 17l9.2-9.2M17 17V7h-10" : "M17 7l-9.2 9.2M7 7v10h10"}
                      />
                    </svg>
                    {change.value}%
                  </span>
                  {change.period && (
                    <span className="text-xs text-muted-foreground">
                      {change.period}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {icon && (
              <div className={cn(
                "text-primary/60",
                variant === "compact" ? "text-2xl" : "text-3xl"
              )}>
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
StatsCard.displayName = "StatsCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ProductCard,
  FeatureCard,
  TestimonialCard,
  StatsCard,
  cardVariants,
}