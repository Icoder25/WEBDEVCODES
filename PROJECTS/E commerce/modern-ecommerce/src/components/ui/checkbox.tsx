"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground hover:bg-primary/10",
        destructive: "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground hover:bg-destructive/10",
        outline: "border-2 data-[state=checked]:bg-transparent data-[state=checked]:text-primary hover:bg-muted",
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

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>
>(({ className, variant, size, animation, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size, animation }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className={cn(
        "stroke-[3]",
        size === "sm" && "h-2 w-2",
        size === "default" && "h-3 w-3",
        size === "lg" && "h-4 w-4",
        size === "xl" && "h-5 w-5"
      )} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Enhanced Checkbox with label and description
interface EnhancedCheckboxProps {
  id?: string
  label?: string
  description?: string
  required?: boolean
  error?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  animation?: VariantProps<typeof checkboxVariants>["animation"]
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  labelClassName?: string
  descriptionClassName?: string
}

function EnhancedCheckbox({
  id,
  label,
  description,
  required,
  error,
  variant = "default",
  size = "default",
  animation = "scale",
  checked,
  onCheckedChange,
  disabled,
  className,
  labelClassName,
  descriptionClassName,
}: EnhancedCheckboxProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={id}
          variant={variant}
          size={size}
          animation={animation}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="mt-0.5"
        />
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className={cn(
              "text-sm text-muted-foreground",
              descriptionClassName
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Checkbox Group
interface CheckboxGroupProps {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  value?: string[]
  onValueChange?: (value: string[]) => void
  label?: string
  description?: string
  required?: boolean
  error?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  animation?: VariantProps<typeof checkboxVariants>["animation"]
  orientation?: "vertical" | "horizontal"
  columns?: number
  className?: string
  disabled?: boolean
}

function CheckboxGroup({
  options,
  value = [],
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
}: CheckboxGroupProps) {
  const handleCheckedChange = (optionValue: string, checked: boolean) => {
    const newValue = checked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue)
    onValueChange?.(newValue)
  }

  const gridCols = columns ? `grid-cols-${columns}` : 
    orientation === "horizontal" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"

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
      
      <div className={cn(
        "grid gap-3",
        gridCols
      )}>
        {options.map((option) => (
          <EnhancedCheckbox
            key={option.value}
            id={`checkbox-${option.value}`}
            label={option.label}
            description={option.description}
            variant={variant}
            size={size}
            animation={animation}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Indeterminate Checkbox (for "select all" functionality)
interface IndeterminateCheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  animation?: VariantProps<typeof checkboxVariants>["animation"]
  disabled?: boolean
  className?: string
}

function IndeterminateCheckbox({
  checked = false,
  indeterminate = false,
  onCheckedChange,
  label,
  variant = "default",
  size = "default",
  animation = "scale",
  disabled,
  className,
}: IndeterminateCheckboxProps) {
  const checkboxRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <CheckboxPrimitive.Root
        ref={checkboxRef}
        className={cn(checkboxVariants({ variant, size, animation }))}
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          {indeterminate ? (
            <Minus className={cn(
              "stroke-[3]",
              size === "sm" && "h-2 w-2",
              size === "default" && "h-3 w-3",
              size === "lg" && "h-4 w-4",
              size === "xl" && "h-5 w-5"
            )} />
          ) : (
            <Check className={cn(
              "stroke-[3]",
              size === "sm" && "h-2 w-2",
              size === "default" && "h-3 w-3",
              size === "lg" && "h-4 w-4",
              size === "xl" && "h-5 w-5"
            )} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}

// Terms and Conditions Checkbox
interface TermsCheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  termsText?: string
  termsLink?: string
  privacyText?: string
  privacyLink?: string
  required?: boolean
  error?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  className?: string
}

function TermsCheckbox({
  checked = false,
  onCheckedChange,
  termsText = "Terms of Service",
  termsLink = "/terms",
  privacyText = "Privacy Policy",
  privacyLink = "/privacy",
  required = true,
  error,
  variant = "default",
  size = "default",
  className,
}: TermsCheckboxProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          variant={variant}
          size={size}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-0.5"
        />
        <div className="text-sm leading-relaxed">
          <span>I agree to the </span>
          <a
            href={termsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {termsText}
          </a>
          <span> and </span>
          <a
            href={privacyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {privacyText}
          </a>
          {required && <span className="text-destructive ml-1">*</span>}
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Newsletter Checkbox
interface NewsletterCheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  className?: string
}

function NewsletterCheckbox({
  checked = false,
  onCheckedChange,
  label = "Subscribe to newsletter",
  description = "Get updates about new products, sales, and exclusive offers.",
  variant = "default",
  size = "default",
  className,
}: NewsletterCheckboxProps) {
  return (
    <EnhancedCheckbox
      label={label}
      description={description}
      variant={variant}
      size={size}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={className}
    />
  )
}

// Filter Checkbox (for product filtering)
interface FilterCheckboxProps {
  value: string
  label: string
  count?: number
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  disabled?: boolean
  className?: string
}

function FilterCheckbox({
  value,
  label,
  count,
  checked = false,
  onCheckedChange,
  variant = "default",
  size = "default",
  disabled,
  className,
}: FilterCheckboxProps) {
  return (
    <div className={cn("flex items-center justify-between group", className)}>
      <div className="flex items-center space-x-3">
        <Checkbox
          variant={variant}
          size={size}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
        <label className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
          {label}
        </label>
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  )
}

export {
  Checkbox,
  EnhancedCheckbox,
  CheckboxGroup,
  IndeterminateCheckbox,
  TermsCheckbox,
  NewsletterCheckbox,
  FilterCheckbox,
  checkboxVariants,
}