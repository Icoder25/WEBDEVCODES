"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        destructive: "bg-destructive/20",
        success: "bg-green-100 dark:bg-green-900/20",
        warning: "bg-yellow-100 dark:bg-yellow-900/20",
        info: "bg-blue-100 dark:bg-blue-900/20",
        glass: "bg-white/10 backdrop-blur-sm border border-white/20",
        gradient: "bg-gradient-to-r from-muted to-muted/50",
        neumorphism: "bg-background shadow-neumorphism-inset",
        glow: "bg-secondary shadow-inner",
      },
      size: {
        sm: "h-2",
        default: "h-4",
        lg: "h-6",
        xl: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
        glass: "bg-white/30 backdrop-blur-sm",
        gradient: "bg-gradient-to-r from-primary to-secondary",
        neumorphism: "bg-primary shadow-neumorphism",
        glow: "bg-primary shadow-glow",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        glow: "animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
)

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & 
  VariantProps<typeof progressVariants> & {
    indicatorAnimation?: VariantProps<typeof progressIndicatorVariants>["animation"]
  }
>(({ className, value, variant, size, indicatorAnimation, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant, animation: indicatorAnimation }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Enhanced Progress with label and percentage
interface EnhancedProgressProps {
  value?: number
  max?: number
  label?: string
  showPercentage?: boolean
  showValue?: boolean
  variant?: VariantProps<typeof progressVariants>["variant"]
  size?: VariantProps<typeof progressVariants>["size"]
  indicatorAnimation?: VariantProps<typeof progressIndicatorVariants>["animation"]
  className?: string
  labelClassName?: string
  valueClassName?: string
  formatValue?: (value: number, max: number) => string
}

function EnhancedProgress({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  showValue = false,
  variant = "default",
  size = "default",
  indicatorAnimation = "none",
  className,
  labelClassName,
  valueClassName,
  formatValue,
}: EnhancedProgressProps) {
  const percentage = Math.round((value / max) * 100)
  const displayValue = formatValue ? formatValue(value, max) : `${value}/${max}`

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={cn("text-sm font-medium", labelClassName)}>
              {label}
            </span>
          )}
          <div className="flex items-center gap-2">
            {showValue && (
              <span className={cn("text-sm text-muted-foreground", valueClassName)}>
                {displayValue}
              </span>
            )}
            {showPercentage && (
              <span className={cn("text-sm font-medium", valueClassName)}>
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}
      <Progress
        value={percentage}
        variant={variant}
        size={size}
        indicatorAnimation={indicatorAnimation}
      />
    </div>
  )
}

// Circular Progress
interface CircularProgressProps {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  showValue?: boolean
  label?: string
  variant?: "default" | "success" | "warning" | "destructive" | "info"
  className?: string
  formatValue?: (value: number, max: number) => string
}

function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  showValue = false,
  label,
  variant = "default",
  className,
  formatValue,
}: CircularProgressProps) {
  const percentage = (value / max) * 100
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const displayValue = formatValue ? formatValue(value, max) : `${value}/${max}`

  const getStrokeColor = () => {
    switch (variant) {
      case "success": return "stroke-green-500"
      case "warning": return "stroke-yellow-500"
      case "destructive": return "stroke-red-500"
      case "info": return "stroke-blue-500"
      default: return "stroke-primary"
    }
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-out", getStrokeColor())}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold">
            {Math.round(percentage)}%
          </span>
        )}
        {showValue && (
          <span className="text-sm text-muted-foreground">
            {displayValue}
          </span>
        )}
        {label && (
          <span className="text-xs text-muted-foreground text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// Multi-step Progress
interface Step {
  id: string
  label: string
  description?: string
  completed?: boolean
  current?: boolean
  disabled?: boolean
}

interface MultiStepProgressProps {
  steps: Step[]
  currentStep?: number
  variant?: VariantProps<typeof progressVariants>["variant"]
  orientation?: "horizontal" | "vertical"
  showLabels?: boolean
  showDescriptions?: boolean
  className?: string
  onStepClick?: (stepIndex: number) => void
}

function MultiStepProgress({
  steps,
  currentStep = 0,
  variant = "default",
  orientation = "horizontal",
  showLabels = true,
  showDescriptions = false,
  className,
  onStepClick,
}: MultiStepProgressProps) {
  const isHorizontal = orientation === "horizontal"
  
  return (
    <div className={cn(
      "flex",
      isHorizontal ? "flex-col space-y-4" : "flex-row space-x-4",
      className
    )}>
      {/* Progress bar */}
      <div className={cn(
        "flex items-center",
        isHorizontal ? "w-full" : "flex-col h-full"
      )}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = onStepClick && !step.disabled
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 transition-all duration-200",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary text-primary bg-background"
                    : "border-muted text-muted-foreground bg-background",
                  isClickable && "cursor-pointer hover:scale-110",
                  step.disabled && "opacity-50 cursor-not-allowed",
                  "w-8 h-8 text-sm font-medium"
                )}
                onClick={() => isClickable && onStepClick(index)}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "transition-all duration-200",
                  isHorizontal ? "flex-1 h-0.5 mx-2" : "w-0.5 flex-1 my-2",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      
      {/* Step labels */}
      {showLabels && (
        <div className={cn(
          "flex",
          isHorizontal ? "justify-between" : "flex-col space-y-8"
        )}>
          {steps.map((step, index) => {
            const isCurrent = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div
                key={`${step.id}-label`}
                className={cn(
                  "text-center",
                  isHorizontal ? "flex-1" : "flex-none",
                  !isHorizontal && "text-left"
                )}
              >
                <div className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </div>
                {showDescriptions && step.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Loading Progress (indeterminate)
interface LoadingProgressProps {
  variant?: VariantProps<typeof progressVariants>["variant"]
  size?: VariantProps<typeof progressVariants>["size"]
  className?: string
  label?: string
}

function LoadingProgress({
  variant = "default",
  size = "default",
  className,
  label,
}: LoadingProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="text-sm font-medium">{label}</div>
      )}
      <div className={cn(progressVariants({ variant, size }))}>
        <div className={cn(
          progressIndicatorVariants({ variant }),
          "w-1/3 animate-loading-progress"
        )} />
      </div>
    </div>
  )
}

// Upload Progress
interface UploadProgressProps {
  files: Array<{
    id: string
    name: string
    progress: number
    status: "uploading" | "completed" | "error"
    size?: number
  }>
  onCancel?: (fileId: string) => void
  className?: string
}

function UploadProgress({
  files,
  onCancel,
  className,
}: UploadProgressProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      {files.map((file) => {
        const variant = file.status === "error" ? "destructive" : file.status === "completed" ? "success" : "default"
        
        return (
          <div key={file.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{file.name}</div>
                {file.size && (
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {file.progress}%
                </span>
                {file.status === "uploading" && onCancel && (
                  <button
                    onClick={() => onCancel(file.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <Progress
              value={file.progress}
              variant={variant}
              indicatorAnimation={file.status === "uploading" ? "shimmer" : "none"}
            />
          </div>
        )
      })}
    </div>
  )
}

export {
  Progress,
  EnhancedProgress,
  CircularProgress,
  MultiStepProgress,
  LoadingProgress,
  UploadProgress,
  progressVariants,
  progressIndicatorVariants,
}