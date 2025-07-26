'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from './product-card'
import { Product, ProductFilters } from '@/types'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
  showFilters?: boolean
  showSearch?: boolean
  showViewToggle?: boolean
  defaultView?: 'grid' | 'list'
  itemsPerPage?: number
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
]

const priceRanges = [
  { min: 0, max: 500, label: 'Under ₹500' },
  { min: 500, max: 1000, label: '₹500 - ₹1,000' },
  { min: 1000, max: 2000, label: '₹1,000 - ₹2,000' },
  { min: 2000, max: 5000, label: '₹2,000 - ₹5,000' },
  { min: 5000, max: Infinity, label: 'Above ₹5,000' },
]

export default function ProductGrid({
  products,
  loading = false,
  className,
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  defaultView = 'grid',
  itemsPerPage = 12
}: ProductGridProps) {
  const [view, setView] = useState<'grid' | 'list'>(defaultView)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: Infinity },
    rating: 0,
    inStock: false,
    featured: false,
    onSale: false
  })
  
  // Extract unique categories and brands from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.sort()
  }, [products])
  
  const brands = useMemo(() => {
    const brandSet = new Set(products.map(p => p.brand).filter(Boolean))
    return [...brandSet].sort()
  }, [products])
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }
      
      // Brand filter
      if (filters.brands.length > 0 && (!product.brand || !filters.brands.includes(product.brand))) {
        return false
      }
      
      // Price range filter
      const minPrice = Math.min(...product.pricing.map(p => p.price))
      if (minPrice < filters.priceRange.min || minPrice > filters.priceRange.max) {
        return false
      }
      
      // Rating filter
      if (filters.rating > 0 && (!product.rating || product.rating < filters.rating)) {
        return false
      }
      
      // Stock filter
      if (filters.inStock && product.stock <= 0) {
        return false
      }
      
      // Featured filter
      if (filters.featured && !product.featured) {
        return false
      }
      
      // On sale filter
      if (filters.onSale && !product.originalPrice) {
        return false
      }
      
      return true
    })
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return Math.min(...a.pricing.map(p => p.price)) - Math.min(...b.pricing.map(p => p.price))
        case 'price-desc':
          return Math.min(...b.pricing.map(p => p.price)) - Math.min(...a.pricing.map(p => p.price))
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
      }
    })
    
    return filtered
  }, [products, searchQuery, sortBy, filters])
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, filters])
  
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: Infinity },
      rating: 0,
      inStock: false,
      featured: false,
      onSale: false
    })
    setSearchQuery('')
  }
  
  const activeFiltersCount = (
    filters.categories.length +
    filters.brands.length +
    (filters.priceRange.min > 0 || filters.priceRange.max < Infinity ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.onSale ? 1 : 0)
  )
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Filters Toggle */}
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...filters.categories, category]
                                : filters.categories.filter(c => c !== category)
                              handleFilterChange('categories', newCategories)
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Brands */}
                  <div>
                    <h4 className="font-semibold mb-3">Brands</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand)}
                            onChange={(e) => {
                              const newBrands = e.target.checked
                                ? [...filters.brands, brand]
                                : filters.brands.filter(b => b !== brand)
                              handleFilterChange('brands', newBrands)
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                            onChange={() => handleFilterChange('priceRange', { min: range.min, max: range.max })}
                            className="border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Other Filters */}
                  <div>
                    <h4 className="font-semibold mb-3">Other Filters</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm">In Stock Only</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.featured}
                          onChange={(e) => handleFilterChange('featured', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm">Featured Products</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.onSale}
                          onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm">On Sale</span>
                      </label>
                      
                      {/* Rating Filter */}
                      <div>
                        <span className="text-sm font-medium mb-2 block">Minimum Rating</span>
                        <div className="space-y-1">
                          {[4, 3, 2, 1].map(rating => (
                            <label key={rating} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="rating"
                                checked={filters.rating === rating}
                                onChange={() => handleFilterChange('rating', rating)}
                                className="border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3 w-3",
                                      i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    )}
                                  />
                                ))}
                                <span className="text-sm ml-1">& up</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginatedProducts.length} of {filteredProducts.length} products
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>
      
      {/* Products Grid/List */}
      {loading ? (
        <div className={cn(
          "grid gap-6",
          view === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}>
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || activeFiltersCount > 0
              ? 'Try adjusting your search or filters'
              : 'No products available at the moment'
            }
          </p>
          {(searchQuery || activeFiltersCount > 0) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            view === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard 
                  product={product} 
                  variant={view === 'list' ? 'compact' : 'default'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              const isCurrentPage = page === currentPage
              const showPage = 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              
              if (!showPage) {
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>
                }
                return null
              }
              
              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10 p-0"
                >
                  {page}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}