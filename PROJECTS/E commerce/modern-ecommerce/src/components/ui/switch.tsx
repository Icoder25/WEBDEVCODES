"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-input/80",
        destructive: "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-input/80",
        success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-input/80",
        warning: "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-input/80",
        ghost: "data-[state=checked]:bg-primary/20 data-[state=unchecked]:bg-muted hover:data-[state=unchecked]:bg-muted/80",
        glass: "data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-white/10 backdrop-blur-sm border-white/20 hover:data-[state=unchecked]:bg-white/20",
        gradient: "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-input/80",
        neumorphism: "data-[state=checked]:shadow-neumorphism-inset data-[state=unchecked]:shadow-neumorphism bg-background",
        glow: "data-[state=checked]:bg-primary data-[state=checked]:shadow-glow data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-input/80",
      },
      size: {
        sm: "h-4 w-7",
        default: "h-6 w-11",
        lg: "h-7 w-12",
        xl: "h-8 w-14",
      },
      animation: {
        none: "",
        bounce: "data-[state=checked]:animate-bounce-once",
        pulse: "data-[state=checked]:animate-pulse-once",
        wiggle: "data-[state=checked]:animate-wiggle",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-background",
        destructive: "data-[state=checked]:bg-background",
        success: "data-[state=checked]:bg-background",
        warning: "data-[state=checked]:bg-background",
        ghost: "data-[state=checked]:bg-primary",
        glass: "data-[state=checked]:bg-white data-[state=unchecked]:bg-white/80 backdrop-blur-sm",
        gradient: "data-[state=checked]:bg-background",
        neumorphism: "data-[state=checked]:shadow-neumorphism data-[state=unchecked]:shadow-neumorphism-inset bg-background",
        glow: "data-[state=checked]:bg-background data-[state=checked]:shadow-sm",
      },
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
        default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        xl: "h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>
>(({ className, variant, size, animation, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(switchVariants({ variant, size, animation }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(switchThumbVariants({ variant, size }))}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

// Enhanced Switch with label and description
interface EnhancedSwitchProps {
  id?: string
  label?: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  variant?: VariantProps<typeof switchVariants>["variant"]
  size?: VariantProps<typeof switchVariants>["size"]
  animation?: VariantProps<typeof switchVariants>["animation"]
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  labelClassName?: string
  descriptionClassName?: string
  labelPosition?: "left" | "right"
}

function EnhancedSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  variant = "default",
  size = "default",
  animation = "none",
  disabled,
  required,
  error,
  className,
  labelClassName,
  descriptionClassName,
  labelPosition = "right",
}: EnhancedSwitchProps) {
  const switchElement = (
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      variant={variant}
      size={size}
      animation={animation}
      disabled={disabled}
    />
  )

  const labelElement = label && (
    <div className="grid gap-1.5 leading-none">
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
      {description && (
        <p className={cn(
          "text-sm text-muted-foreground",
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </div>
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn(
        "flex items-center space-x-3",
        labelPosition === "left" && "flex-row-reverse space-x-reverse"
      )}>
        {switchElement}
        {labelElement}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

// Icon Switch (with icons instead of text)
interface IconSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  checkedIcon?: React.ReactNode
  uncheckedIcon?: React.ReactNode
  variant?: VariantProps<typeof switchVariants>["variant"]
  size?: VariantProps<typeof switchVariants>["size"]
  disabled?: boolean
  className?: string
}

function IconSwitch({
  checked,
  onCheckedChange,
  checkedIcon,
  uncheckedIcon,
  variant = "default",
  size = "default",
  disabled,
  className,
}: IconSwitchProps) {
  return (
    <div className={cn("relative", className)}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        variant={variant}
        size={size}
        disabled={disabled}
        className="relative"
      />
      {(checkedIcon || uncheckedIcon) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={cn(
            "transition-opacity duration-200",
            checked ? "opacity-100" : "opacity-0"
          )}>
            {checkedIcon}
          </div>
          <div className={cn(
            "absolute transition-opacity duration-200",
            !checked ? "opacity-100" : "opacity-0"
          )}>
            {uncheckedIcon}
          </div>
        </div>
      )}
    </div>
  )
}

// Theme Switch (Dark/Light mode)
interface ThemeSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: VariantProps<typeof switchVariants>["size"]
  className?: string
}

function ThemeSwitch({
  checked,
  onCheckedChange,
  size = "default",
  className,
}: ThemeSwitchProps) {
  return (
    <IconSwitch
      checked={checked}
      onCheckedChange={onCheckedChange}
      size={size}
      variant="gradient"
      className={className}
      checkedIcon={
        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      }
      uncheckedIcon={
        <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      }
    />
  )
}

// Notification Switch
interface NotificationSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  size?: VariantProps<typeof switchVariants>["size"]
  className?: string
}

function NotificationSwitch({
  checked,
  onCheckedChange,
  label = "Push Notifications",
  description = "Receive notifications about orders, promotions, and updates",
  size = "default",
  className,
}: NotificationSwitchProps) {
  return (
    <EnhancedSwitch
      label={label}
      description={description}
      checked={checked}
      onCheckedChange={onCheckedChange}
      variant="default"
      size={size}
      className={className}
    />
  )
}

// Privacy Switch
interface PrivacySwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  size?: VariantProps<typeof switchVariants>["size"]
  className?: string
}

function PrivacySwitch({
  checked,
  onCheckedChange,
  label = "Data Collection",
  description = "Allow collection of usage data to improve your experience",
  size = "default",
  className,
}: PrivacySwitchProps) {
  return (
    <EnhancedSwitch
      label={label}
      description={description}
      checked={checked}
      onCheckedChange={onCheckedChange}
      variant="ghost"
      size={size}
      className={className}
    />
  )
}

// Marketing Switch
interface MarketingSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  size?: VariantProps<typeof switchVariants>["size"]
  className?: string
}

function MarketingSwitch({
  checked,
  onCheckedChange,
  label = "Marketing Emails",
  description = "Receive emails about new products, sales, and exclusive offers",
  size = "default",
  className,
}: MarketingSwitchProps) {
  return (
    <EnhancedSwitch
      label={label}
      description={description}
      checked={checked}
      onCheckedChange={onCheckedChange}
      variant="default"
      size={size}
      className={className}
    />
  )
}

// Feature Toggle Switch
interface FeatureToggleSwitchProps {
  feature: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  badge?: string
  size?: VariantProps<typeof switchVariants>["size"]
  className?: string
}

function FeatureToggleSwitch({
  feature,
  checked,
  onCheckedChange,
  label,
  description,
  badge,
  size = "default",
  className,
}: FeatureToggleSwitchProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            variant="default"
            size={size}
          />
          <div className="grid gap-1.5 leading-none">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium leading-none cursor-pointer">
                {label || feature}
              </label>
              {badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Switch Group (for multiple related switches)
interface SwitchGroupProps {
  switches: Array<{
    id: string
    label: string
    description?: string
    checked?: boolean
    disabled?: boolean
  }>
  onSwitchChange?: (id: string, checked: boolean) => void
  label?: string
  description?: string
  variant?: VariantProps<typeof switchVariants>["variant"]
  size?: VariantProps<typeof switchVariants>["size"]
  className?: string
}

function SwitchGroup({
  switches,
  onSwitchChange,
  label,
  description,
  variant = "default",
  size = "default",
  className,
}: SwitchGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">{label}</label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        {switches.map((switchItem) => (
          <EnhancedSwitch
            key={switchItem.id}
            id={switchItem.id}
            label={switchItem.label}
            description={switchItem.description}
            checked={switchItem.checked}
            onCheckedChange={(checked) => onSwitchChange?.(switchItem.id, checked)}
            variant={variant}
            size={size}
            disabled={switchItem.disabled}
          />
        ))}
      </div>
    </div>
  )
}

export {
  Switch,
  EnhancedSwitch,
  IconSwitch,
  ThemeSwitch,
  NotificationSwitch,
  PrivacySwitch,
  MarketingSwitch,
  FeatureToggleSwitch,
  SwitchGroup,
  switchVariants,
  switchThumbVariants,
}