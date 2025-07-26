"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const radioGroupVariants = cva(
  "grid gap-2",
  {
    variants: {
      orientation: {
        vertical: "grid-cols-1",
        horizontal: "grid-flow-col auto-cols-max gap-6",
      },
      columns: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

const radioItemVariants = cva(
  "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:bg-primary/10",
        destructive: "border-destructive text-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground hover:bg-destructive/10",
        outline: "border-2 data-[state=checked]:bg-transparent data-[state=checked]:border-primary data-[state=checked]:text-primary hover:bg-muted",
        ghost: "border-transparent data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:bg-muted",
        glass: "bg-white/10 border-white/20 backdrop-blur-sm data-[state=checked]:bg-white/20 data-[state=checked]:text-foreground hover:bg-white/20",
        gradient: "border-0 bg-gradient-to-r from-primary/20 to-secondary/20 data-[state=checked]:from-primary data-[state=checked]:to-secondary data-[state=checked]:text-primary-foreground hover:from-primary/30 hover:to-secondary/30",
        neumorphism: "bg-background shadow-neumorphism-inset data-[state=checked]:shadow-neumorphism data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        glow: "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-glow hover:bg-primary/10",
      },
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
      animation: {
        none: "",
        bounce: "data-[state=checked]:animate-bounce-once",
        pulse: "data-[state=checked]:animate-pulse-once",
        scale: "data-[state=checked]:animate-scale-in",
        wiggle: "data-[state=checked]:animate-wiggle",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
)

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & VariantProps<typeof radioGroupVariants>
>(({ className, orientation, columns, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupVariants({ orientation, columns }), className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & VariantProps<typeof radioItemVariants>
>(({ className, variant, size, animation, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemVariants({ variant, size, animation }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn(
          "fill-current text-current",
          size === "sm" && "h-1.5 w-1.5",
          size === "default" && "h-2.5 w-2.5",
          size === "lg" && "h-3 w-3",
          size === "xl" && "h-4 w-4"
        )} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Enhanced Radio Group with labels and descriptions
interface EnhancedRadioGroupProps {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
    icon?: React.ReactNode
  }>
  value?: string
  onValueChange?: (value: string) => void
  label?: string
  description?: string
  required?: boolean
  error?: string
  variant?: VariantProps<typeof radioItemVariants>["variant"]
  size?: VariantProps<typeof radioItemVariants>["size"]
  animation?: VariantProps<typeof radioItemVariants>["animation"]
  orientation?: VariantProps<typeof radioGroupVariants>["orientation"]
  columns?: VariantProps<typeof radioGroupVariants>["columns"]
  className?: string
  disabled?: boolean
}

function EnhancedRadioGroup({
  options,
  value,
  onValueChange,
  label,
  description,
  required,
  error,
  variant = "default",
  size = "default",
  animation = "scale",
  orientation = "vertical",
  columns,
  className,
  disabled,
}: EnhancedRadioGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        orientation={orientation}
        columns={columns}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              variant={variant}
              size={size}
              animation={animation}
              disabled={disabled || option.disabled}
              className="mt-0.5"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={option.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
              >
                {option.icon}
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Card Radio Group (for visual selection)
interface CardRadioGroupProps {
  options: Array<{
    value: string
    label: string
    description?: string
    icon?: React.ReactNode
    image?: string
    price?: string
    badge?: string
    disabled?: boolean
  }>
  value?: string
  onValueChange?: (value: string) => void
  label?: string
  description?: string
  required?: boolean
  error?: string
  columns?: number
  className?: string
  disabled?: boolean
}

function CardRadioGroup({
  options,
  value,
  onValueChange,
  label,
  description,
  required,
  error,
  columns = 2,
  className,
  disabled,
}: CardRadioGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className={cn(
          "grid gap-4",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              disabled={disabled || option.disabled}
              className="peer sr-only"
            />
            <label
              htmlFor={option.value}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
              )}
            >
              {option.image && (
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-16 h-16 object-cover rounded-md mb-3"
                />
              )}
              {option.icon && (
                <div className="mb-3 text-2xl">{option.icon}</div>
              )}
              <div className="text-center space-y-1">
                <div className="font-medium text-sm">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                )}
                {option.price && (
                  <div className="text-sm font-semibold text-primary">
                    {option.price}
                  </div>
                )}
              </div>
              {option.badge && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {option.badge}
                </div>
              )}
            </label>
          </div>
        ))}
      </RadioGroup>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Size Radio Group (for clothing sizes)
interface SizeRadioGroupProps {
  sizes: Array<{
    value: string
    label: string
    available?: boolean
  }>
  value?: string
  onValueChange?: (value: string) => void
  label?: string
  className?: string
}

function SizeRadioGroup({
  sizes,
  value,
  onValueChange,
  label = "Size",
  className,
}: SizeRadioGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium">{label}</label>
      
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-2"
      >
        {sizes.map((size) => (
          <div key={size.value} className="relative">
            <RadioGroupItem
              value={size.value}
              id={size.value}
              disabled={size.available === false}
              className="peer sr-only"
            />
            <label
              htmlFor={size.value}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-md border-2 border-muted bg-background text-sm font-medium cursor-pointer transition-all duration-200",
                "hover:border-primary hover:bg-primary/5",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:line-through",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
              )}
            >
              {size.label}
            </label>
            {size.available === false && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-destructive rotate-45" />
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

// Color Radio Group (for color selection)
interface ColorRadioGroupProps {
  colors: Array<{
    value: string
    label: string
    color: string
    available?: boolean
  }>
  value?: string
  onValueChange?: (value: string) => void
  label?: string
  className?: string
}

function ColorRadioGroup({
  colors,
  value,
  onValueChange,
  label = "Color",
  className,
}: ColorRadioGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium">{label}</label>
      
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-2"
      >
        {colors.map((color) => (
          <div key={color.value} className="relative group">
            <RadioGroupItem
              value={color.value}
              id={color.value}
              disabled={color.available === false}
              className="peer sr-only"
            />
            <label
              htmlFor={color.value}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 border-muted cursor-pointer transition-all duration-200",
                "hover:scale-110 hover:border-primary",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
              )}
              style={{ backgroundColor: color.color }}
              title={color.label}
            >
              {color.available === false && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-destructive rotate-45" />
                </div>
              )}
            </label>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {color.label}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

// Payment Method Radio Group
interface PaymentMethodRadioGroupProps {
  methods: Array<{
    value: string
    label: string
    description?: string
    icon?: React.ReactNode
    fee?: string
    disabled?: boolean
  }>
  value?: string
  onValueChange?: (value: string) => void
  label?: string
  className?: string
}

function PaymentMethodRadioGroup({
  methods,
  value,
  onValueChange,
  label = "Payment Method",
  className,
}: PaymentMethodRadioGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <label className="text-sm font-medium">{label}</label>
      
      <RadioGroup value={value} onValueChange={onValueChange} className="space-y-3">
        {methods.map((method) => (
          <div key={method.value} className="relative">
            <RadioGroupItem
              value={method.value}
              id={method.value}
              disabled={method.disabled}
              className="peer sr-only"
            />
            <label
              htmlFor={method.value}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-background cursor-pointer transition-all duration-200",
                "hover:border-primary hover:bg-primary/5",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
              )}
            >
              <div className="flex items-center space-x-3">
                {method.icon && (
                  <div className="text-xl">{method.icon}</div>
                )}
                <div>
                  <div className="font-medium text-sm">{method.label}</div>
                  {method.description && (
                    <div className="text-xs text-muted-foreground">
                      {method.description}
                    </div>
                  )}
                </div>
              </div>
              {method.fee && (
                <div className="text-sm text-muted-foreground">
                  {method.fee}
                </div>
              )}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export {
  RadioGroup,
  RadioGroupItem,
  EnhancedRadioGroup,
  CardRadioGroup,
  SizeRadioGroup,
  ColorRadioGroup,
  PaymentMethodRadioGroup,
  radioGroupVariants,
  radioItemVariants,
}