"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const accordionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-border rounded-lg",
        separated: "space-y-2",
        ghost: "",
        glass: "backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg",
        gradient: "bg-gradient-to-br from-background to-muted/50 border border-border rounded-lg",
        neumorphism: "bg-background shadow-neumorphism rounded-lg",
        glow: "bg-background border border-primary/20 shadow-glow rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const accordionItemVariants = cva(
  "border-b transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        bordered: "border-border first:rounded-t-lg last:rounded-b-lg last:border-b-0",
        separated: "border border-border rounded-lg bg-background hover:shadow-md",
        ghost: "border-transparent hover:bg-muted/50",
        glass: "border-white/10 backdrop-blur-sm bg-white/5 rounded-lg mb-2 last:mb-0",
        gradient: "border-border/50 bg-gradient-to-r from-background to-muted/30 rounded-lg mb-2 last:mb-0",
        neumorphism: "border-transparent bg-background shadow-neumorphism-inset rounded-lg mb-2 last:mb-0",
        glow: "border-primary/10 bg-background/50 rounded-lg mb-2 last:mb-0 hover:shadow-glow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & VariantProps<typeof accordionVariants>
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(accordionVariants({ variant }), className)}
    {...props}
  />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & VariantProps<typeof accordionItemVariants>
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    hideChevron?: boolean
    icon?: React.ReactNode
  }
>(({ className, children, hideChevron = false, icon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 px-4 font-medium transition-all hover:underline text-left group",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 transition-colors group-hover:text-primary">
            {icon}
          </div>
        )}
        <span>{children}</span>
      </div>
      {!hideChevron && (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0 px-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// Enhanced Accordion with predefined items
interface AccordionItemData {
  id: string
  trigger: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string
}

interface EnhancedAccordionProps {
  items: AccordionItemData[]
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  variant?: VariantProps<typeof accordionVariants>["variant"]
  collapsible?: boolean
  className?: string
  onValueChange?: (value: string | string[]) => void
}

function EnhancedAccordion({
  items,
  type = "single",
  defaultValue,
  variant = "default",
  collapsible = true,
  className,
  onValueChange,
}: EnhancedAccordionProps) {
  return (
    <Accordion
      type={type as any}
      defaultValue={defaultValue as any}
      collapsible={collapsible}
      variant={variant}
      className={className}
      onValueChange={onValueChange as any}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          variant={variant}
          className={item.disabled ? "opacity-50 pointer-events-none" : ""}
        >
          <AccordionTrigger icon={item.icon}>
            <div className="flex items-center justify-between w-full">
              <span>{item.trigger}</span>
              {item.badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mr-2">
                  {item.badge}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

// FAQ Accordion
interface FAQItem {
  id: string
  question: string
  answer: string | React.ReactNode
  category?: string
}

interface FAQAccordionProps {
  faqs: FAQItem[]
  searchable?: boolean
  categorized?: boolean
  variant?: VariantProps<typeof accordionVariants>["variant"]
  className?: string
}

function FAQAccordion({
  faqs,
  searchable = false,
  categorized = false,
  variant = "separated",
  className,
}: FAQAccordionProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  const filteredFAQs = React.useMemo(() => {
    let filtered = faqs

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof faq.answer === "string" && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    return filtered
  }, [faqs, searchTerm, selectedCategory])

  const categories = React.useMemo(() => {
    if (!categorized) return []
    return Array.from(new Set(faqs.map((faq) => faq.category).filter(Boolean)))
  }, [faqs, categorized])

  const groupedFAQs = React.useMemo(() => {
    if (!categorized) return { "All": filteredFAQs }
    
    const grouped = filteredFAQs.reduce((acc, faq) => {
      const category = faq.category || "Other"
      if (!acc[category]) acc[category] = []
      acc[category].push(faq)
      return acc
    }, {} as Record<string, FAQItem[]>)
    
    return grouped
  }, [filteredFAQs, categorized])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and filters */}
      {(searchable || categorized) && (
        <div className="space-y-4">
          {searchable && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
          
          {categorized && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ Content */}
      {categorized ? (
        <div className="space-y-8">
          {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
            <div key={category}>
              {category !== "All" && (
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
              )}
              <EnhancedAccordion
                items={categoryFAQs.map((faq) => ({
                  id: faq.id,
                  trigger: faq.question,
                  content: faq.answer,
                }))}
                variant={variant}
                type="single"
                collapsible
              />
            </div>
          ))}
        </div>
      ) : (
        <EnhancedAccordion
          items={filteredFAQs.map((faq) => ({
            id: faq.id,
            trigger: faq.question,
            content: faq.answer,
          }))}
          variant={variant}
          type="single"
          collapsible
        />
      )}

      {filteredFAQs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No FAQs found matching your criteria.
        </div>
      )}
    </div>
  )
}

// Product Details Accordion
interface ProductDetailsAccordionProps {
  description?: string
  specifications?: Record<string, string | string[]>
  shippingInfo?: string | React.ReactNode
  returnPolicy?: string | React.ReactNode
  reviews?: {
    count: number
    average: number
    component?: React.ReactNode
  }
  variant?: VariantProps<typeof accordionVariants>["variant"]
  className?: string
}

function ProductDetailsAccordion({
  description,
  specifications,
  shippingInfo,
  returnPolicy,
  reviews,
  variant = "bordered",
  className,
}: ProductDetailsAccordionProps) {
  const items: AccordionItemData[] = []

  if (description) {
    items.push({
      id: "description",
      trigger: "Description",
      content: (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {typeof description === "string" ? (
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          ) : (
            description
          )}
        </div>
      ),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    })
  }

  if (specifications && Object.keys(specifications).length > 0) {
    items.push({
      id: "specifications",
      trigger: "Specifications",
      content: (
        <div className="space-y-3">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between items-start">
              <span className="font-medium text-sm">{key}:</span>
              <span className="text-sm text-muted-foreground text-right">
                {Array.isArray(value) ? value.join(", ") : value}
              </span>
            </div>
          ))}
        </div>
      ),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    })
  }

  if (shippingInfo) {
    items.push({
      id: "shipping",
      trigger: "Shipping & Delivery",
      content: shippingInfo,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    })
  }

  if (returnPolicy) {
    items.push({
      id: "returns",
      trigger: "Returns & Exchanges",
      content: returnPolicy,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
    })
  }

  if (reviews) {
    items.push({
      id: "reviews",
      trigger: "Reviews",
      content: reviews.component || (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Reviews component not provided</p>
        </div>
      ),
      badge: reviews.count.toString(),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    })
  }

  return (
    <EnhancedAccordion
      items={items}
      variant={variant}
      type="single"
      collapsible
      className={className}
    />
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  EnhancedAccordion,
  FAQAccordion,
  ProductDetailsAccordion,
  accordionVariants,
  accordionItemVariants,
}