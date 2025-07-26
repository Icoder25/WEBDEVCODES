import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently
 * @param inputs - Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price value with currency symbol
 * @param price - The price to format
 * @param currency - Currency code (default: 'INR')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Formats a date string into a readable format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Generates a random ID string
 * @param length - Length of the ID
 * @returns Random ID string
 */
export function generateId(length: number = 8) {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  } as T
}

/**
 * Calculates discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number) {
  if (originalPrice <= 0) return 0
  const discount = originalPrice - discountedPrice
  const percentage = (discount / originalPrice) * 100
  return Math.round(percentage)
}

/**
 * Safely parses JSON without throwing errors
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    return fallback
  }
}

/**
 * Creates a URL-friendly slug from a string
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '')       // Trim - from end of text
}

/**
 * Gets a random item from an array
 * @param array - Array to get random item from
 * @returns Random item from array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Checks if the current device is mobile
 * @returns Boolean indicating if device is mobile
 */
export function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Extracts initials from a name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}