'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Product, SearchFilters, SearchResult } from '@/types'
import { debounce, throttle } from '@/lib/utils'

// Local Storage Hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

// Session Storage Hook
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

// Debounced Value Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Previous Value Hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// Media Query Hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Responsive Breakpoints
export function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const is2Xl = useMediaQuery('(min-width: 1536px)')

  return {
    isMobile: !isSm,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
  }
}

// Window Size Hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Scroll Position Hook
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updatePosition = throttle(() => {
      setScrollPosition(window.pageYOffset)
    }, 100)

    window.addEventListener('scroll', updatePosition)
    updatePosition()

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

// Scroll Direction Hook
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScrollDirection = throttle(() => {
      const scrollY = window.pageYOffset
      const direction = scrollY > lastScrollY ? 'down' : 'up'
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction)
      }
      
      setLastScrollY(scrollY > 0 ? scrollY : 0)
    }, 100)

    window.addEventListener('scroll', updateScrollDirection)
    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [scrollDirection, lastScrollY])

  return scrollDirection
}

// Click Outside Hook
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [callback])

  return ref
}

// Escape Key Hook
export function useEscapeKey(callback: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [callback])
}

// Focus Trap Hook
export function useFocusTrap<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          event.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return ref
}

// Async Hook
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  }
}

// Intersection Observer Hook (for lazy loading)
export function useLazyLoad(options?: IntersectionObserverInit) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  })

  return { ref, inView }
}

// Image Loading Hook
export function useImageLoad(src: string) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) {
      setLoading(false)
      setError(true)
      return
    }

    setLoading(true)
    setError(false)

    const img = new Image()
    img.onload = () => {
      setLoading(false)
      setError(false)
    }
    img.onerror = () => {
      setLoading(false)
      setError(true)
    }
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { loading, error }
}

// Copy to Clipboard Hook
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }, [])

  return { copiedText, copy }
}

// Toggle Hook
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setToggle = useCallback((value: boolean) => setValue(value), [])

  return [value, toggle, setToggle]
}

// Counter Hook
export function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount(c => c + step), [step])
  const decrement = useCallback(() => setCount(c => c - step), [step])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  const set = useCallback((value: number) => setCount(value), [])

  return {
    count,
    increment,
    decrement,
    reset,
    set,
  }
}

// Array Hook
export function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState(initialArray)

  const push = useCallback((element: T) => {
    setArray(arr => [...arr, element])
  }, [])

  const filter = useCallback((callback: (item: T, index: number) => boolean) => {
    setArray(arr => arr.filter(callback))
  }, [])

  const update = useCallback((index: number, newElement: T) => {
    setArray(arr => [
      ...arr.slice(0, index),
      newElement,
      ...arr.slice(index + 1),
    ])
  }, [])

  const remove = useCallback((index: number) => {
    setArray(arr => [
      ...arr.slice(0, index),
      ...arr.slice(index + 1),
    ])
  }, [])

  const clear = useCallback(() => setArray([]), [])

  return {
    array,
    set: setArray,
    push,
    filter,
    update,
    remove,
    clear,
  }
}

// Search Hook
export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  query: string
) {
  return useMemo(() => {
    if (!query.trim()) return items

    const lowercaseQuery = query.toLowerCase()
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercaseQuery)
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowercaseQuery)
        }
        return false
      })
    )
  }, [items, searchFields, query])
}

// Pagination Hook
export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const reset = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  }
}

// Form Hook
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const setTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
  }, [])

  const validateForm = useCallback(() => {
    if (!validate) return true
    
    const newErrors = validate(values)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const handleChange = useCallback((name: keyof T) => (value: any) => {
    setValue(name, value)
    if (validate && touched[name]) {
      const newErrors = validate({ ...values, [name]: value })
      setError(name, newErrors[name] || '')
    }
  }, [values, touched, validate, setValue, setError])

  const handleBlur = useCallback((name: keyof T) => () => {
    setTouched(name, true)
    if (validate) {
      const newErrors = validate(values)
      setError(name, newErrors[name] || '')
    }
  }, [values, validate, setError])

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched: setTouched,
    validateForm,
    reset,
    handleChange,
    handleBlur,
    isValid: Object.keys(errors).length === 0,
  }
}

// Interval Hook
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// Timeout Hook
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}

// Online Status Hook
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Battery Status Hook
export function useBatteryStatus() {
  const [battery, setBattery] = useState<{
    charging: boolean
    level: number
    chargingTime: number
    dischargingTime: number
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('getBattery' in navigator)) return

    ;(navigator as any).getBattery().then((battery: any) => {
      const updateBattery = () => {
        setBattery({
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        })
      }

      updateBattery()

      battery.addEventListener('chargingchange', updateBattery)
      battery.addEventListener('levelchange', updateBattery)
      battery.addEventListener('chargingtimechange', updateBattery)
      battery.addEventListener('dischargingtimechange', updateBattery)

      return () => {
        battery.removeEventListener('chargingchange', updateBattery)
        battery.removeEventListener('levelchange', updateBattery)
        battery.removeEventListener('chargingtimechange', updateBattery)
        battery.removeEventListener('dischargingtimechange', updateBattery)
      }
    })
  }, [])

  return battery
}