import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl",
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 shadow-lg hover:shadow-xl",
        neumorphism:
          "bg-background shadow-neumorphism hover:shadow-neumorphism-hover border-0",
        glow:
          "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      animation: {
        none: "",
        bounce: "hover:animate-bounce",
        pulse: "hover:animate-pulse",
        wiggle: "hover:animate-wiggle",
        float: "hover:animate-float",
        glow: "hover:animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, animation, className }),
          loading && "cursor-not-allowed opacity-70"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2 flex items-center">{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className="ml-2 flex items-center">{rightIcon}</span>
            )}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Button Group Component
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", size, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          "rounded-md shadow-sm",
          className
        )}
        role="group"
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === Button) {
            const isFirst = index === 0
            const isLast = index === React.Children.count(children) - 1
            
            return React.cloneElement(child, {
              ...child.props,
              size: size || child.props.size,
              variant: variant || child.props.variant,
              className: cn(
                child.props.className,
                orientation === "horizontal"
                  ? {
                      "rounded-l-none": !isFirst,
                      "rounded-r-none": !isLast,
                      "border-l-0": !isFirst && (variant === "outline" || child.props.variant === "outline"),
                    }
                  : {
                      "rounded-t-none": !isFirst,
                      "rounded-b-none": !isLast,
                      "border-t-0": !isFirst && (variant === "outline" || child.props.variant === "outline"),
                    }
              ),
            })
          }
          return child
        })}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

// Icon Button Component
export interface IconButtonProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode
  "aria-label": string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = "icon", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={cn("shrink-0", className)}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

// Floating Action Button Component
export interface FABProps extends ButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, position = "bottom-right", size = "lg", variant = "default", ...props }, ref) => {
    const positionClasses = {
      "bottom-right": "fixed bottom-6 right-6",
      "bottom-left": "fixed bottom-6 left-6",
      "top-right": "fixed top-6 right-6",
      "top-left": "fixed top-6 left-6",
    }

    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(
          "rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50",
          positionClasses[position],
          className
        )}
        {...props}
      />
    )
  }
)
FAB.displayName = "FAB"

// Split Button Component
export interface SplitButtonProps {
  children: React.ReactNode
  dropdownItems: React.ReactNode
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
  onMainClick?: () => void
  disabled?: boolean
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({ children, dropdownItems, variant, size, className, onMainClick, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <div ref={ref} className={cn("relative inline-flex", className)} {...props}>
        <Button
          variant={variant}
          size={size}
          onClick={onMainClick}
          disabled={disabled}
          className="rounded-r-none border-r-0"
        >
          {children}
        </Button>
        <Button
          variant={variant}
          size={size}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="rounded-l-none px-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-max bg-background border border-border rounded-md shadow-lg z-10">
            {dropdownItems}
          </div>
        )}
      </div>
    )
  }
)
SplitButton.displayName = "SplitButton"

export { Button, ButtonGroup, IconButton, FAB, SplitButton, buttonVariants }