'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Package,
  Truck,
  CreditCard,
  Gift
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTax,
    getShipping,
    getDiscount,
    getTotal,
    getTotalItems
  } = useCartStore()
  
  const [isClearing, setIsClearing] = useState(false)
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }
  
  const handleClearCart = async () => {
    setIsClearing(true)
    // Add a small delay for better UX
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
  }
  
  const subtotal = getSubtotal()
  const tax = getTax()
  const shipping = getShipping()
  const discount = getDiscount()
  const total = getTotal()
  const totalItems = getTotalItems()
  
  // Free shipping threshold
  const freeShippingThreshold = 2000
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({totalItems})
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Free Shipping Progress */}
          {remainingForFreeShipping > 0 && items.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Free shipping on orders over ₹2,000</span>
                <span className="font-medium text-primary-600">
                  ₹{remainingForFreeShipping} to go
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full px-6 py-12 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some products to get started
                </p>
                <Button 
                  onClick={() => onOpenChange(false)}
                  className="bg-gradient-to-r from-primary-600 to-primary-700"
                >
                  Continue Shopping
                </Button>
              </motion.div>
            ) : (
              <div className="px-6 py-4 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-1">
                        {item.product.brand}
                      </p>
                      
                      {/* Pricing Tier Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          MOQ: {item.pricingTier.minQuantity}
                        </Badge>
                        <span className="text-sm font-medium text-primary-600">
                          {formatPrice(item.pricingTier.price)}
                        </span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Stock Warning */}
                      {item.quantity >= item.product.stock && (
                        <p className="text-xs text-orange-600 mt-1">
                          Maximum stock reached
                        </p>
                      )}
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(item.pricingTier.price * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-gray-500">
                          {formatPrice(item.pricingTier.price)} each
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer with Summary and Checkout */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-gray-200 p-6">
            <div className="w-full space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Shipping
                  </span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-primary-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Package className="h-4 w-4 text-primary-600" />
                  <span className="text-xs text-gray-600">Quality Assured</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-4 w-4 text-primary-600" />
                  <span className="text-xs text-gray-600">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <CreditCard className="h-4 w-4 text-primary-600" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Continue Shopping
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <Badge variant="outline" className="text-xs">
                  <Gift className="w-3 h-3 mr-1" />
                  Free Returns
                </Badge>
                <Badge variant="outline" className="text-xs">
                  100% Authentic
                </Badge>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}