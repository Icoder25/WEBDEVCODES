"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/50",
        filled: "bg-muted border-transparent hover:bg-muted/80",
        flushed: "border-0 border-b-2 border-input rounded-none px-0 focus:border-primary",
        ghost: "border-transparent hover:bg-muted",
        glass: "bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus:ring-destructive",
        success: "border-green-500 focus:ring-green-500",
        warning: "border-yellow-500 focus:ring-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectTriggerVariants>
>(({ className, children, variant, size, state, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size, state }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-150",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Enhanced Select with label and helper text
interface EnhancedSelectProps {
  label?: string
  placeholder?: string
  helperText?: string
  errorText?: string
  required?: boolean
  variant?: VariantProps<typeof selectTriggerVariants>["variant"]
  size?: VariantProps<typeof selectTriggerVariants>["size"]
  state?: VariantProps<typeof selectTriggerVariants>["state"]
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

function EnhancedSelect({
  label,
  placeholder,
  helperText,
  errorText,
  required,
  variant = "default",
  size = "default",
  state = "default",
  value,
  onValueChange,
  children,
  className,
  disabled,
}: EnhancedSelectProps) {
  const finalState = errorText ? "error" : state
  const helpText = errorText || helperText

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger variant={variant} size={size} state={finalState}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
      {helpText && (
        <p className={cn(
          "text-sm",
          errorText ? "text-destructive" : "text-muted-foreground"
        )}>
          {helpText}
        </p>
      )}
    </div>
  )
}

// Multi Select Component
interface MultiSelectProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  label?: string
  helperText?: string
  errorText?: string
  required?: boolean
  variant?: VariantProps<typeof selectTriggerVariants>["variant"]
  size?: VariantProps<typeof selectTriggerVariants>["size"]
  maxSelected?: number
  className?: string
  disabled?: boolean
}

function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  label,
  helperText,
  errorText,
  required,
  variant = "default",
  size = "default",
  maxSelected,
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const finalState = errorText ? "error" : "default"
  const helpText = errorText || helperText

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : maxSelected && value.length >= maxSelected
        ? value
        : [...value, optionValue]
    
    onValueChange?.(newValue)
  }

  const selectedLabels = value
    .map(v => options.find(opt => opt.value === v)?.label)
    .filter(Boolean)

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            selectTriggerVariants({ variant, size, state: finalState }),
            "justify-between",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
        >
          <span className="flex-1 text-left truncate">
            {selectedLabels.length > 0 ? (
              <span className="flex flex-wrap gap-1">
                {selectedLabels.slice(0, 2).map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {label}
                  </span>
                ))}
                {selectedLabels.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                    +{selectedLabels.length - 2} more
                  </span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            open && "rotate-180"
          )} />
        </button>
        
        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            <div className="p-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                const isDisabled = option.disabled || (maxSelected && !isSelected && value.length >= maxSelected)
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(option.value)}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors duration-150",
                      isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                      isDisabled && "pointer-events-none opacity-50"
                    )}
                    disabled={isDisabled}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {isSelected && <Check className="h-4 w-4" />}
                    </span>
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      {helpText && (
        <p className={cn(
          "text-sm",
          errorText ? "text-destructive" : "text-muted-foreground"
        )}>
          {helpText}
        </p>
      )}
      
      {/* Click outside to close */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}

// Country Select
interface CountrySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  helperText?: string
  errorText?: string
  required?: boolean
  variant?: VariantProps<typeof selectTriggerVariants>["variant"]
  size?: VariantProps<typeof selectTriggerVariants>["size"]
  className?: string
  disabled?: boolean
}

function CountrySelect(props: CountrySelectProps) {
  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "cn", label: "China" },
    { value: "in", label: "India" },
    { value: "br", label: "Brazil" },
  ]

  return (
    <EnhancedSelect {...props} placeholder={props.placeholder || "Select country"}>
      {countries.map((country) => (
        <SelectItem key={country.value} value={country.value}>
          {country.label}
        </SelectItem>
      ))}
    </EnhancedSelect>
  )
}

// Currency Select
interface CurrencySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  helperText?: string
  errorText?: string
  required?: boolean
  variant?: VariantProps<typeof selectTriggerVariants>["variant"]
  size?: VariantProps<typeof selectTriggerVariants>["size"]
  className?: string
  disabled?: boolean
}

function CurrencySelect(props: CurrencySelectProps) {
  const currencies = [
    { value: "usd", label: "USD - US Dollar", symbol: "$" },
    { value: "eur", label: "EUR - Euro", symbol: "€" },
    { value: "gbp", label: "GBP - British Pound", symbol: "£" },
    { value: "jpy", label: "JPY - Japanese Yen", symbol: "¥" },
    { value: "cad", label: "CAD - Canadian Dollar", symbol: "C$" },
    { value: "aud", label: "AUD - Australian Dollar", symbol: "A$" },
    { value: "chf", label: "CHF - Swiss Franc", symbol: "CHF" },
    { value: "cny", label: "CNY - Chinese Yuan", symbol: "¥" },
  ]

  return (
    <EnhancedSelect {...props} placeholder={props.placeholder || "Select currency"}>
      {currencies.map((currency) => (
        <SelectItem key={currency.value} value={currency.value}>
          <span className="flex items-center gap-2">
            <span className="font-mono text-xs bg-muted px-1 rounded">
              {currency.symbol}
            </span>
            {currency.label}
          </span>
        </SelectItem>
      ))}
    </EnhancedSelect>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  EnhancedSelect,
  MultiSelect,
  CountrySelect,
  CurrencySelect,
  selectTriggerVariants,
}