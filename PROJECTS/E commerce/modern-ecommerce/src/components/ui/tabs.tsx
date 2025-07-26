"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const tabsListVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground transition-all",
  {
    variants: {
      variant: {
        default: "bg-muted",
        underline: "bg-transparent border-b border-border",
        pills: "bg-muted/50 gap-1",
        ghost: "bg-transparent",
        glass: "bg-white/10 backdrop-blur-sm border border-white/20",
        gradient: "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20",
      },
      size: {
        sm: "h-8 text-sm",
        default: "h-10",
        lg: "h-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50",
        pills: "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted",
        ghost: "data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50",
        glass: "data-[state=active]:bg-white/20 data-[state=active]:text-foreground hover:bg-white/10",
        gradient: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground hover:bg-muted/50",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-50 slide-in-from-bottom-1 duration-200",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Animated Tabs with indicator
interface AnimatedTabsProps {
  tabs: Array<{
    value: string
    label: string
    icon?: React.ReactNode
    badge?: string | number
    disabled?: boolean
  }>
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: VariantProps<typeof tabsListVariants>["variant"]
  size?: VariantProps<typeof tabsListVariants>["size"]
  className?: string
  children?: React.ReactNode
}

function AnimatedTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = "default",
  size = "default",
  className,
  children,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.value)
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({})
  const tabsRef = React.useRef<HTMLDivElement>(null)
  const triggerRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const updateIndicator = React.useCallback(() => {
    const activeElement = triggerRefs.current[activeTab]
    if (activeElement && tabsRef.current) {
      const tabsRect = tabsRef.current.getBoundingClientRect()
      const activeRect = activeElement.getBoundingClientRect()
      
      setIndicatorStyle({
        left: activeRect.left - tabsRect.left,
        width: activeRect.width,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      })
    }
  }, [activeTab])

  React.useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleValueChange} className={className}>
      <div className="relative">
        <TabsList ref={tabsRef} variant={variant} size={size} className="relative">
          {variant === "underline" && (
            <div
              className="absolute bottom-0 h-0.5 bg-primary rounded-full"
              style={indicatorStyle}
            />
          )}
          {variant === "default" && (
            <div
              className="absolute bg-background rounded-sm shadow-sm"
              style={{
                ...indicatorStyle,
                height: 'calc(100% - 8px)',
                top: '4px',
              }}
            />
          )}
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              variant={variant}
              size={size}
              disabled={tab.disabled}
              ref={(el) => {
                triggerRefs.current[tab.value] = el
              }}
              className="relative z-10 flex items-center gap-2"
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {tab.badge}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  )
}

// Product Tabs for product details
interface ProductTabsProps {
  product?: {
    description?: string
    specifications?: Array<{ label: string; value: string }>
    reviews?: Array<any>
    shipping?: {
      info: string
      estimatedDays: number
      cost: number
    }
  }
  className?: string
}

function ProductTabs({ product, className }: ProductTabsProps) {
  const tabs = [
    {
      value: "description",
      label: "Description",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      value: "specifications",
      label: "Specifications",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      value: "reviews",
      label: "Reviews",
      badge: product?.reviews?.length || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      value: "shipping",
      label: "Shipping",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ]

  return (
    <AnimatedTabs tabs={tabs} variant="underline" className={className}>
      <TabsContent value="description" className="space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>{product?.description || "No description available."}</p>
        </div>
      </TabsContent>
      
      <TabsContent value="specifications" className="space-y-4">
        {product?.specifications && product.specifications.length > 0 ? (
          <div className="grid gap-3">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                <span className="font-medium text-muted-foreground">{spec.label}</span>
                <span className="text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No specifications available.</p>
        )}
      </TabsContent>
      
      <TabsContent value="reviews" className="space-y-4">
        {product?.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < (review.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium">{review.author || 'Anonymous'}</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        )}
      </TabsContent>
      
      <TabsContent value="shipping" className="space-y-4">
        {product?.shipping ? (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="font-medium text-muted-foreground">Estimated Delivery</span>
                <span className="text-foreground">{product.shipping.estimatedDays} days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="font-medium text-muted-foreground">Shipping Cost</span>
                <span className="text-foreground">${product.shipping.cost.toFixed(2)}</span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>{product.shipping.info}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Shipping information not available.</p>
        )}
      </TabsContent>
    </AnimatedTabs>
  )
}

// Category Tabs for filtering
interface CategoryTabsProps {
  categories: Array<{
    id: string
    name: string
    count?: number
    icon?: React.ReactNode
  }>
  activeCategory?: string
  onCategoryChange?: (categoryId: string) => void
  variant?: VariantProps<typeof tabsListVariants>["variant"]
  className?: string
}

function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  variant = "pills",
  className,
}: CategoryTabsProps) {
  const tabs = categories.map(category => ({
    value: category.id,
    label: category.name,
    badge: category.count,
    icon: category.icon,
  }))

  return (
    <AnimatedTabs
      tabs={tabs}
      value={activeCategory}
      onValueChange={onCategoryChange}
      variant={variant}
      className={className}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AnimatedTabs,
  ProductTabs,
  CategoryTabs,
  tabsListVariants,
  tabsTriggerVariants,
}