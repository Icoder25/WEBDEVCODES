import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Search, X } from "lucide-react"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input hover:border-ring/50",
        filled: "bg-muted border-transparent hover:bg-muted/80 focus-visible:bg-background",
        flushed: "border-0 border-b-2 border-input rounded-none px-0 focus-visible:ring-0 focus-visible:border-ring",
        ghost: "border-transparent bg-transparent hover:bg-muted/50",
        glass: "bg-white/10 backdrop-blur-md border-white/20 placeholder:text-white/70",
      },
      inputSize: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3",
        lg: "h-12 px-4 text-base",
        xl: "h-14 px-6 text-lg",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
  helperText?: string
  errorMessage?: string
  isRequired?: boolean
  isLoading?: boolean
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      state,
      leftIcon,
      rightIcon,
      label,
      helperText,
      errorMessage,
      isRequired,
      isLoading,
      clearable,
      onClear,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const hasError = !!errorMessage || state === "error"
    const inputType = isPassword && showPassword ? "text" : type
    const hasValue = value !== undefined && value !== ""

    const inputId = React.useId()

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={inputType}
            className={cn(
              inputVariants({
                variant,
                inputSize,
                state: hasError ? "error" : state,
                className,
              }),
              leftIcon && "pl-10",
              (rightIcon || isPassword || clearable || isLoading) && "pr-10",
              isLoading && "cursor-wait"
            )}
            ref={ref}
            value={value}
            disabled={disabled || isLoading}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />
            )}
            
            {clearable && hasValue && !isLoading && (
              <button
                type="button"
                onClick={onClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {rightIcon && !isPassword && !clearable && !isLoading && (
              <div className="text-muted-foreground">{rightIcon}</div>
            )}
          </div>
        </div>
        
        {(helperText || errorMessage) && (
          <p
            className={cn(
              "text-xs",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, "leftIcon" | "type"> {
  onSearch?: (value: string) => void
  searchDelay?: number
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, searchDelay = 300, value, onChange, ...props }, ref) => {
    const [searchValue, setSearchValue] = React.useState(value || "")
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
      if (onSearch) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          onSearch(searchValue as string)
        }, searchDelay)
      }
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [searchValue, onSearch, searchDelay])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchValue(newValue)
      onChange?.(e)
    }

    const handleClear = () => {
      setSearchValue("")
      onSearch?.("")
    }

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        value={searchValue}
        onChange={handleChange}
        clearable
        onClear={handleClear}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Number Input Component
export interface NumberInputProps extends Omit<InputProps, "type"> {
  min?: number
  max?: number
  step?: number
  precision?: number
  onIncrement?: () => void
  onDecrement?: () => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      precision,
      value,
      onChange,
      onIncrement,
      onDecrement,
      disabled,
      ...props
    },
    ref
  ) => {
    const numericValue = typeof value === "string" ? parseFloat(value) || 0 : (value as number) || 0

    const increment = () => {
      const newValue = numericValue + step
      const clampedValue = max !== undefined ? Math.min(newValue, max) : newValue
      const finalValue = precision !== undefined ? parseFloat(clampedValue.toFixed(precision)) : clampedValue
      
      onChange?.({ target: { value: finalValue.toString() } } as React.ChangeEvent<HTMLInputElement>)
      onIncrement?.()
    }

    const decrement = () => {
      const newValue = numericValue - step
      const clampedValue = min !== undefined ? Math.max(newValue, min) : newValue
      const finalValue = precision !== undefined ? parseFloat(clampedValue.toFixed(precision)) : clampedValue
      
      onChange?.({ target: { value: finalValue.toString() } } as React.ChangeEvent<HTMLInputElement>)
      onDecrement?.()
    }

    const canIncrement = max === undefined || numericValue < max
    const canDecrement = min === undefined || numericValue > min

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="pr-16"
          {...props}
        />
        
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
          <button
            type="button"
            onClick={increment}
            disabled={disabled || !canIncrement}
            className="px-2 py-1 text-xs hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            tabIndex={-1}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || !canDecrement}
            className="px-2 py-1 text-xs hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            tabIndex={-1}
          >
            ▼
          </button>
        </div>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

// OTP Input Component
export interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  className?: string
  inputClassName?: string
  autoFocus?: boolean
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      onComplete,
      disabled,
      className,
      inputClassName,
      autoFocus,
    },
    ref
  ) => {
    const [otp, setOtp] = React.useState(value.split("").slice(0, length))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, [])

    React.useEffect(() => {
      const otpValue = otp.join("")
      onChange?.(otpValue)
      
      if (otpValue.length === length) {
        onComplete?.(otpValue)
      }
    }, [otp, length, onChange, onComplete])

    const handleChange = (index: number, digit: string) => {
      if (digit.length > 1) {
        // Handle paste
        const pastedData = digit.slice(0, length)
        const newOtp = pastedData.split("").concat(Array(length - pastedData.length).fill(""))
        setOtp(newOtp)
        
        const nextIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[nextIndex]?.focus()
        return
      }

      const newOtp = [...otp]
      newOtp[index] = digit
      setOtp(newOtp)

      // Move to next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    return (
      <div ref={ref} className={cn("flex gap-2", className)}>
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={length}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
              disabled && "opacity-50 cursor-not-allowed",
              inputClassName
            )}
          />
        ))}
      </div>
    )
  }
)
OTPInput.displayName = "OTPInput"

// File Input Component
export interface FileInputProps extends Omit<InputProps, "type" | "value" | "onChange"> {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onFileSelect?: (files: FileList | null) => void
  onError?: (error: string) => void
  preview?: boolean
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      accept,
      multiple,
      maxSize,
      onFileSelect,
      onError,
      preview,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [dragActive, setDragActive] = React.useState(false)
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const validateFiles = (files: FileList) => {
      const validFiles: File[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (maxSize && file.size > maxSize) {
          onError?.(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
          continue
        }
        
        validFiles.push(file)
      }
      
      return validFiles
    }

    const handleFiles = (files: FileList | null) => {
      if (!files) return
      
      const validFiles = validateFiles(files)
      setSelectedFiles(validFiles)
      onFileSelect?.(files)
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    }

    return (
      <div className="w-full space-y-4">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            {...props}
          />
          
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            {accept && (
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: {accept}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-muted-foreground">
                Max size: {maxSize / 1024 / 1024}MB
              </p>
            )}
          </div>
        </div>
        
        {preview && selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-20 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground text-center p-2">
                      {file.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = selectedFiles.filter((_, i) => i !== index)
                    setSelectedFiles(newFiles)
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { Input, SearchInput, NumberInput, OTPInput, FileInput, inputVariants }