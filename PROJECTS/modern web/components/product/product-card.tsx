'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Package, 
  Zap,
  TrendingUp,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { Product } from '@/types'
import { cn, formatPrice, calculateDiscountPercentage } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  showQuickView?: boolean
  showWishlist?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

export default function ProductCard({
  product,
  className,
  showQuickView = true,
  showWishlist = true,
  variant = 'default'
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<number | null>(null)
  
  const addToCart = useCartStore((state) => state.addItem)
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id)
  const primaryImage = product.images[0]
  const secondaryImage = product.images[1]
  
  // Get the best pricing tier (lowest price for display)
  const bestTier = product.pricing.reduce((best, current) => 
    current.price < best.price ? current : best
  )
  
  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, bestTier.price)
    : 0
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, bestTier.minQuantity)
  }
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Implement quick view modal
    console.log('Quick view:', product.id)
  }
  
  const cardVariants = {
    default: "group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1",
    compact: "group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg",
    featured: "group relative bg-white rounded-2xl border-2 border-primary-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2"
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(cardVariants[variant], className)}
    >
      <Link href={`/shop/products/${product.slug}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Primary Image */}
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              secondaryImage && "group-hover:opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Secondary Image (Hover Effect) */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt}
              fill
              className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-0">
                <Zap className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                -{discountPercentage}%
              </Badge>
            )}
            {product.trending && (
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {showWishlist && (
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "w-10 h-10 rounded-full p-0 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white transition-all duration-300",
                  isInWishlist && "bg-red-50 border-red-200 text-red-600"
                )}
                onClick={handleWishlistToggle}
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />
              </Button>
            )}
            
            {showQuickView && (
              <Button
                size="sm"
                variant="outline"
                className="w-10 h-10 rounded-full p-0 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white transition-all duration-300"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Stock Status */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="destructive" className="bg-orange-500">
                <Package className="w-3 h-3 mr-1" />
                Only {product.stock} left
              </Badge>
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <CardContent className="p-4">
          {/* Category */}
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          )}
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(product.rating!)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}
          
          {/* Pricing Tiers */}
          <div className="space-y-2 mb-4">
            {product.pricing.map((tier, index) => (
              <motion.div
                key={index}
                className={cn(
                  "flex justify-between items-center p-2 rounded-lg border transition-all duration-200",
                  hoveredTier === index
                    ? "border-primary-300 bg-primary-50"
                    : "border-gray-200 bg-gray-50"
                )}
                onMouseEnter={() => setHoveredTier(index)}
                onMouseLeave={() => setHoveredTier(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(tier.price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    MOQ: {tier.minQuantity} pcs
                  </div>
                </div>
                {index === 0 && (
                  <Badge variant="default" className="text-xs">
                    Best Price
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Original Price */}
          {product.originalPrice && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="destructive" className="text-xs">
                Save {discountPercentage}%
              </Badge>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white border-0 transition-all duration-300 group-hover:shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Link>
    </motion.div>
  )
}