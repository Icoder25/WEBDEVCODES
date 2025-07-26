"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const sliderTrackVariants = cva(
  "relative h-2 w-full grow overflow-hidden rounded-full transition-all",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        gradient: "bg-gradient-to-r from-secondary to-muted",
        glass: "bg-white/20 backdrop-blur-sm border border-white/30",
      },
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const sliderRangeVariants = cva(
  "absolute h-full transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary",
        gradient: "bg-gradient-to-r from-primary to-secondary",
        glass: "bg-white/40 backdrop-blur-sm",
        glow: "bg-primary shadow-lg shadow-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const sliderThumbVariants = cva(
  "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:scale-110 active:scale-95",
        gradient: "bg-gradient-to-r from-primary to-secondary border-0 hover:scale-110 active:scale-95",
        glass: "bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 hover:scale-110 active:scale-95",
        glow: "shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 hover:scale-110 active:scale-95",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {
  variant?: "default" | "gradient" | "glass" | "glow"
  trackVariant?: "default" | "gradient" | "glass"
  rangeVariant?: "default" | "gradient" | "glass" | "glow"
  thumbVariant?: "default" | "gradient" | "glass" | "glow"
  showValue?: boolean
  showTicks?: boolean
  tickCount?: number
  formatValue?: (value: number) => string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ 
  className, 
  size,
  variant = "default",
  trackVariant,
  rangeVariant,
  thumbVariant,
  showValue = false,
  showTicks = false,
  tickCount = 5,
  formatValue = (value) => value.toString(),
  ...props 
}, ref) => {
  const finalTrackVariant = trackVariant || variant
  const finalRangeVariant = rangeVariant || variant
  const finalThumbVariant = thumbVariant || variant
  
  const value = props.value || props.defaultValue || [0]
  const min = props.min || 0
  const max = props.max || 100
  const step = props.step || 1
  
  const ticks = React.useMemo(() => {
    if (!showTicks) return []
    const tickStep = (max - min) / (tickCount - 1)
    return Array.from({ length: tickCount }, (_, i) => min + i * tickStep)
  }, [showTicks, tickCount, min, max])

  return (
    <div className="space-y-2">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(sliderVariants({ size }), className)}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(sliderTrackVariants({ variant: finalTrackVariant, size }))}
        >
          <SliderPrimitive.Range 
            className={cn(sliderRangeVariants({ variant: finalRangeVariant }))}
          />
        </SliderPrimitive.Track>
        {value.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className={cn(sliderThumbVariants({ variant: finalThumbVariant, size }))}
          >
            {showValue && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md">
                {formatValue(value[index])}
              </div>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
      
      {showTicks && (
        <div className="relative">
          {ticks.map((tick, index) => {
            const position = ((tick - min) / (max - min)) * 100
            return (
              <div
                key={index}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                <div className="h-1 w-px bg-muted-foreground/30" />
                <span className="mt-1 text-xs text-muted-foreground">
                  {formatValue(tick)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

// Price Range Slider
interface PriceRangeSliderProps {
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  currency?: string
  label?: string
  className?: string
  variant?: "default" | "gradient" | "glass" | "glow"
}

function PriceRangeSlider({
  value = [0, 1000],
  onValueChange,
  min = 0,
  max = 1000,
  step = 10,
  currency = "$",
  label = "Price Range",
  className,
  variant = "default",
}: PriceRangeSliderProps) {
  const formatPrice = (price: number) => `${currency}${price.toLocaleString()}`

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatPrice(value[0])}</span>
          <span>-</span>
          <span>{formatPrice(value[1])}</span>
        </div>
      </div>
      
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        variant={variant}
        showValue
        formatValue={formatPrice}
        className="py-4"
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  )
}

// Rating Slider
interface RatingSliderProps {
  value?: number
  onValueChange?: (value: number) => void
  max?: number
  label?: string
  showStars?: boolean
  className?: string
}

function RatingSlider({
  value = 0,
  onValueChange,
  max = 5,
  label = "Minimum Rating",
  showStars = true,
  className,
}: RatingSliderProps) {
  const handleValueChange = (newValue: number[]) => {
    onValueChange?.(newValue[0])
  }

  const formatRating = (rating: number) => {
    if (showStars) {
      return `${rating} ${rating === 1 ? 'star' : 'stars'}`
    }
    return rating.toString()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-1">
          {showStars && (
            <div className="flex">
              {[...Array(max)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < value ? "text-yellow-400 fill-current" : "text-gray-300"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
          )}
          <span className="text-sm text-muted-foreground ml-1">
            {value} {value === 1 ? 'star' : 'stars'} & up
          </span>
        </div>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={0}
        max={max}
        step={1}
        variant="gradient"
        showTicks
        tickCount={max + 1}
        formatValue={formatRating}
        className="py-4"
      />
    </div>
  )
}

// Size Slider (for clothing, shoes, etc.)
interface SizeSliderProps {
  value?: number
  onValueChange?: (value: number) => void
  sizes?: string[]
  label?: string
  className?: string
}

function SizeSlider({
  value = 0,
  onValueChange,
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  label = "Size",
  className,
}: SizeSliderProps) {
  const handleValueChange = (newValue: number[]) => {
    onValueChange?.(newValue[0])
  }

  const formatSize = (index: number) => sizes[index] || ''

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-medium text-primary">
          {formatSize(value)}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={0}
        max={sizes.length - 1}
        step={1}
        variant="gradient"
        showTicks
        tickCount={sizes.length}
        formatValue={formatSize}
        className="py-4"
      />
    </div>
  )
}

// Quantity Slider
interface QuantitySliderProps {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showInput?: boolean
  className?: string
}

function QuantitySlider({
  value = 1,
  onValueChange,
  min = 1,
  max = 10,
  step = 1,
  label = "Quantity",
  showInput = true,
  className,
}: QuantitySliderProps) {
  const handleValueChange = (newValue: number[]) => {
    onValueChange?.(newValue[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onValueChange?.(newValue)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {showInput && (
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-16 px-2 py-1 text-sm border border-input rounded-md bg-background text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        )}
      </div>
      
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        variant="default"
        showTicks={max <= 20}
        tickCount={Math.min(max - min + 1, 11)}
        className="py-4"
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export {
  Slider,
  PriceRangeSlider,
  RatingSlider,
  SizeSlider,
  QuantitySlider,
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
}