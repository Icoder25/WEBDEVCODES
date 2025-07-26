"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
        "3xl": "h-24 w-24",
      },
      variant: {
        default: "border-2 border-border",
        ghost: "border-0",
        ring: "ring-2 ring-primary ring-offset-2 ring-offset-background",
        glow: "ring-2 ring-primary/50 shadow-glow",
        gradient: "ring-2 ring-gradient-to-r from-primary to-accent ring-offset-2",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, variant, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, variant }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Status Avatar Component
export interface StatusAvatarProps
  extends React.ComponentPropsWithoutRef<typeof Avatar> {
  src?: string
  alt?: string
  fallback?: string
  status?: "online" | "offline" | "away" | "busy"
  showStatus?: boolean
  statusPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
}

const statusPositions = {
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
}

const StatusAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  StatusAvatarProps
>((
  {
    src,
    alt,
    fallback,
    status,
    showStatus = false,
    statusPosition = "bottom-right",
    size = "default",
    className,
    ...props
  },
  ref
) => {
  const statusSize = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    default: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5",
    "3xl": "w-6 h-6",
  }[size]

  return (
    <div className="relative inline-block">
      <Avatar ref={ref} size={size} className={className} {...props}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {showStatus && status && (
        <div
          className={cn(
            "absolute rounded-full border-2 border-background",
            statusColors[status],
            statusSize,
            statusPositions[statusPosition]
          )}
        />
      )}
    </div>
  )
})
StatusAvatar.displayName = "StatusAvatar"

// Avatar Group Component
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    src?: string
    alt?: string
    fallback?: string
  }>
  max?: number
  size?: VariantProps<typeof avatarVariants>["size"]
  variant?: VariantProps<typeof avatarVariants>["variant"]
  spacing?: "tight" | "normal" | "loose"
  showMore?: boolean
}

const spacingClasses = {
  tight: "-space-x-1",
  normal: "-space-x-2",
  loose: "-space-x-3",
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      avatars,
      max = 3,
      size = "default",
      variant = "default",
      spacing = "normal",
      showMore = true,
      className,
      ...props
    },
    ref
  ) => {
    const visibleAvatars = avatars.slice(0, max)
    const remainingCount = avatars.length - max

    return (
      <div
        ref={ref}
        className={cn("flex items-center", spacingClasses[spacing], className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            size={size}
            variant={variant}
            className="border-2 border-background"
          >
            <AvatarImage src={avatar.src} alt={avatar.alt} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
        {showMore && remainingCount > 0 && (
          <Avatar
            size={size}
            variant={variant}
            className="border-2 border-background bg-muted"
          >
            <AvatarFallback className="text-xs font-semibold">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"

// User Avatar Component
export interface UserAvatarProps
  extends React.ComponentPropsWithoutRef<typeof Avatar> {
  user: {
    name: string
    email?: string
    avatar?: string
    initials?: string
  }
  showTooltip?: boolean
  clickable?: boolean
  onClick?: () => void
}

const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UserAvatarProps
>((
  {
    user,
    showTooltip = false,
    clickable = false,
    onClick,
    className,
    ...props
  },
  ref
) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = user.initials || getInitials(user.name)

  const avatarElement = (
    <Avatar
      ref={ref}
      className={cn(
        clickable && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  if (showTooltip) {
    return (
      <div className="group relative">
        {avatarElement}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          <div>{user.name}</div>
          {user.email && (
            <div className="text-gray-300 text-xs">{user.email}</div>
          )}
        </div>
      </div>
    )
  }

  return avatarElement
})
UserAvatar.displayName = "UserAvatar"

// Upload Avatar Component
export interface UploadAvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Avatar>, "children"> {
  currentImage?: string
  onImageChange?: (file: File) => void
  onImageRemove?: () => void
  fallback?: string
  uploadText?: string
  removeText?: string
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

const UploadAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UploadAvatarProps
>((
  {
    currentImage,
    onImageChange,
    onImageRemove,
    fallback = "Upload",
    uploadText = "Click to upload",
    removeText = "Remove image",
    maxSize = 5,
    acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
    className,
    ...props
  },
  ref
) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setError(null)

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Please select a valid image.")
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB.`)
      return
    }

    onImageChange?.(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-2">
      <div className="relative group">
        <Avatar
          ref={ref}
          className={cn(
            "cursor-pointer transition-all duration-200 border-2 border-dashed",
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary",
            className
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          {...props}
        >
          {currentImage ? (
            <AvatarImage src={currentImage} alt="Avatar" />
          ) : (
            <AvatarFallback className="bg-muted text-muted-foreground">
              <div className="flex flex-col items-center justify-center text-center">
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-xs">{fallback}</span>
              </div>
            </AvatarFallback>
          )}
        </Avatar>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {currentImage ? "Change" : uploadText}
          </span>
        </div>

        {/* Remove button */}
        {currentImage && onImageRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onImageRemove()
            }}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
            title={removeText}
          >
            ×
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        {uploadText} or drag and drop
        <br />
        Max {maxSize}MB • {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
      </p>
    </div>
  )
})
UploadAvatar.displayName = "UploadAvatar"

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  StatusAvatar,
  AvatarGroup,
  UserAvatar,
  UploadAvatar,
  avatarVariants,
}