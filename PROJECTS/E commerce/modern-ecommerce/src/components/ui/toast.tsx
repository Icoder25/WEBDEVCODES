"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900 dark:text-green-100",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        info:
          "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100",
        glass:
          "border-white/20 bg-white/10 backdrop-blur-md text-white",
        gradient:
          "border-0 bg-gradient-to-r from-primary to-accent text-white",
        neumorphism:
          "border-0 bg-background text-foreground shadow-neumorphism",
        glow:
          "border-primary/20 bg-background text-foreground shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

// Enhanced Toast Hook
interface ToastOptions {
  id?: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: VariantProps<typeof toastVariants>["variant"]
  duration?: number
  icon?: React.ReactNode
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
  dismissible?: boolean
  onDismiss?: () => void
  onClick?: () => void
}

interface ToastState {
  toasts: Array<ToastOptions & { id: string }>
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ActionType =
  | { type: "ADD_TOAST"; toast: ToastOptions & { id: string } }
  | { type: "UPDATE_TOAST"; toast: Partial<ToastOptions> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: ToastState, action: ActionType): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: ToastState) => void> = []

let memoryState: ToastState = { toasts: [] }

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToastOptions, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToastOptions) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

// Enhanced Toast Components
interface EnhancedToastProps extends ToastProps {
  toast: ToastOptions & { id: string }
}

const EnhancedToast = ({ toast: toastData, ...props }: EnhancedToastProps) => {
  const getIcon = () => {
    if (toastData.icon) return toastData.icon
    
    switch (toastData.variant) {
      case "success":
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "destructive":
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "warning":
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case "info":
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <Toast
      variant={toastData.variant}
      duration={toastData.duration}
      onClick={toastData.onClick}
      {...props}
    >
      <div className="flex items-start gap-3">
        {getIcon() && (
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {toastData.title && (
            <ToastTitle className="mb-1">{toastData.title}</ToastTitle>
          )}
          {toastData.description && (
            <ToastDescription>{toastData.description}</ToastDescription>
          )}
        </div>
      </div>
      {toastData.action}
      {toastData.dismissible !== false && <ToastClose />}
    </Toast>
  )
}

// Predefined Toast Functions
const toastSuccess = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: "success",
    title: "Success",
    description: message,
    ...options,
  })
}

const toastError = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: "destructive",
    title: "Error",
    description: message,
    ...options,
  })
}

const toastWarning = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: "warning",
    title: "Warning",
    description: message,
    ...options,
  })
}

const toastInfo = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: "info",
    title: "Info",
    description: message,
    ...options,
  })
}

// Cart Toast Component
interface CartToastProps {
  product: {
    name: string
    image: string
    price: number
    quantity: number
  }
  onViewCart?: () => void
  onContinueShopping?: () => void
}

const CartToast = ({ product, onViewCart, onContinueShopping }: CartToastProps) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={product.image}
        alt={product.name}
        className="w-12 h-12 rounded-md object-cover"
      />
      <div className="flex-1">
        <ToastTitle className="text-sm">{product.name}</ToastTitle>
        <ToastDescription className="text-xs">
          {product.quantity} × ₹{product.price.toLocaleString()}
        </ToastDescription>
      </div>
      <div className="flex gap-2">
        {onViewCart && (
          <ToastAction onClick={onViewCart} className="text-xs px-2 py-1">
            View Cart
          </ToastAction>
        )}
        {onContinueShopping && (
          <ToastAction onClick={onContinueShopping} className="text-xs px-2 py-1">
            Continue
          </ToastAction>
        )}
      </div>
    </div>
  )
}

// Order Toast Component
interface OrderToastProps {
  orderId: string
  status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  onViewOrder?: () => void
  onTrackOrder?: () => void
}

const OrderToast = ({ orderId, status, onViewOrder, onTrackOrder }: OrderToastProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return { title: 'Order Confirmed', variant: 'success' as const, icon: '✅' }
      case 'shipped':
        return { title: 'Order Shipped', variant: 'info' as const, icon: '🚚' }
      case 'delivered':
        return { title: 'Order Delivered', variant: 'success' as const, icon: '📦' }
      case 'cancelled':
        return { title: 'Order Cancelled', variant: 'destructive' as const, icon: '❌' }
      default:
        return { title: 'Order Update', variant: 'default' as const, icon: '📋' }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{config.icon}</span>
      <div className="flex-1">
        <ToastTitle>{config.title}</ToastTitle>
        <ToastDescription>
          Order #{orderId}
        </ToastDescription>
      </div>
      <div className="flex gap-2">
        {onViewOrder && (
          <ToastAction onClick={onViewOrder} className="text-xs px-2 py-1">
            View
          </ToastAction>
        )}
        {onTrackOrder && status !== 'delivered' && status !== 'cancelled' && (
          <ToastAction onClick={onTrackOrder} className="text-xs px-2 py-1">
            Track
          </ToastAction>
        )}
      </div>
    </div>
  )
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  EnhancedToast,
  CartToast,
  OrderToast,
  useToast,
  toast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
}