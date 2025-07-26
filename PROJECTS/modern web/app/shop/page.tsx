'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Award,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ProductGrid from '@/components/product/product-grid'
import { Product } from '@/types'

// Mock data - In a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Face Serum with Vitamin C',
    slug: 'premium-face-serum-vitamin-c',
    description: 'Advanced anti-aging serum with 20% Vitamin C for radiant, youthful skin',
    category: 'Skincare',
    brand: 'GlowLux',
    images: [
      { url: '/api/placeholder/400/400', alt: 'Premium Face Serum' },
      { url: '/api/placeholder/400/400', alt: 'Serum Application' }
    ],
    pricing: [
      { minQuantity: 1, price: 1299 },
      { minQuantity: 5, price: 1199 },
      { minQuantity: 10, price: 1099 }
    ],
    originalPrice: 1599,
    stock: 50,
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    isNew: false,
    trending: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Matte Liquid Lipstick Set',
    slug: 'matte-liquid-lipstick-set',
    description: 'Long-lasting matte liquid lipstick in 6 stunning shades',
    category: 'Makeup',
    brand: 'ColorPop',
    images: [
      { url: '/api/placeholder/400/400', alt: 'Lipstick Set' },
      { url: '/api/placeholder/400/400', alt: 'Lipstick Swatches' }
    ],
    pricing: [
      { minQuantity: 1, price: 899 },
      { minQuantity: 3, price: 799 },
      { minQuantity: 6, price: 699 }
    ],
    originalPrice: 1199,
    stock: 25,
    rating: 4.6,
    reviewCount: 89,
    featured: false,
    isNew: true,
    trending: false,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Hydrating Hair Mask',
    slug: 'hydrating-hair-mask',
    description: 'Deep conditioning hair mask with argan oil and keratin',
    category: 'Hair Care',
    brand: 'SilkStrands',
    images: [
      { url: '/api/placeholder/400/400', alt: 'Hair Mask' },
      { url: '/api/placeholder/400/400', alt: 'Hair Treatment' }
    ],
    pricing: [
      { minQuantity: 1, price: 649 },
      { minQuantity: 4, price: 599 },
      { minQuantity: 8, price: 549 }
    ],
    stock: 35,
    rating: 4.7,
    reviewCount: 67,
    featured: false,
    isNew: false,
    trending: true,
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'Luxury Perfume Collection',
    slug: 'luxury-perfume-collection',
    description: 'Exquisite fragrance collection with 3 premium scents',
    category: 'Fragrances',
    brand: 'Essence',
    images: [
      { url: '/api/placeholder/400/400', alt: 'Perfume Collection' },
      { url: '/api/placeholder/400/400', alt: 'Perfume Bottles' }
    ],
    pricing: [
      { minQuantity: 1, price: 2499 },
      { minQuantity: 2, price: 2299 },
      { minQuantity: 5, price: 1999 }
    ],
    originalPrice: 2999,
    stock: 15,
    rating: 4.9,
    reviewCount: 156,
    featured: true,
    isNew: false,
    trending: false,
    createdAt: '2024-01-05'
  },
  {
    id: '5',
    name: 'Men\'s Grooming Kit',
    slug: 'mens-grooming-kit',
    description: 'Complete grooming kit with beard oil, face wash, and moisturizer',
    category: 'Men\'s Grooming',
    brand: 'ManCare',
    images: [
      { url: '/api/placeholder/400/400', alt: 'Grooming Kit' },
      { url: '/api/placeholder/400/400', alt: 'Grooming Products' }
    ],
    pricing: [
      { minQuantity: 1, price: 1199 },
      { minQuantity: 3, price: 1099 },
      { minQuantity: 6, price: 999 }
    ],
    stock: 40,
    rating: 4.5,
    reviewCount: 78,
    featured: false,
    isNew: true,
    trending: true,
    createdAt: '2024-01-18'
  },
  {
    id: '6',
    name: 'Anti-Aging Night Cream',
    slug: 'anti-aging-night-cream',
    description: 'Intensive night cream with retinol and hyaluronic acid',
    category: 'Skincare',
    brand: 'YouthGlow',
    images: [
      { url: '/api/placeholder/400/400', alt: 'Night Cream' },
      { url: '/api/placeholder/400/400', alt: 'Skincare Routine' }
    ],
    pricing: [
      { minQuantity: 1, price: 1599 },
      { minQuantity: 2, price: 1499 },
      { minQuantity: 4, price: 1399 }
    ],
    originalPrice: 1899,
    stock: 30,
    rating: 4.7,
    reviewCount: 92,
    featured: true,
    isNew: false,
    trending: false,
    createdAt: '2024-01-12'
  }
]

const categories = [
  { name: 'All Products', count: mockProducts.length, icon: ShoppingBag },
  { name: 'Skincare', count: mockProducts.filter(p => p.category === 'Skincare').length, icon: Sparkles },
  { name: 'Makeup', count: mockProducts.filter(p => p.category === 'Makeup').length, icon: Award },
  { name: 'Hair Care', count: mockProducts.filter(p => p.category === 'Hair Care').length, icon: TrendingUp },
  { name: 'Fragrances', count: mockProducts.filter(p => p.category === 'Fragrances').length, icon: Sparkles },
  { name: 'Men\'s Grooming', count: mockProducts.filter(p => p.category === 'Men\'s Grooming').length, icon: Award },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  
  // Simulate API call
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(mockProducts)
      setLoading(false)
    }
    
    loadProducts()
  }, [])
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'All Products' 
    ? products 
    : products.filter(product => product.category === selectedCategory)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Premium Cosmetics
              <span className="block text-primary-100">Wholesale Collection</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Discover our extensive range of high-quality beauty products at wholesale prices. 
              Perfect for retailers, salons, and beauty professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Premium Quality
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Wholesale Prices
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Fast Delivery
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.name
              
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <Badge 
                    variant={isActive ? 'secondary' : 'outline'}
                    className={`ml-1 ${isActive ? 'bg-white/20 text-white border-white/30' : ''}`}
                  >
                    {category.count}
                  </Badge>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Featured Products Banner */}
          {selectedCategory === 'All Products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        ✨ Featured Products
                      </h2>
                      <p className="text-gray-600">
                        Handpicked premium products with the best wholesale prices
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                      <Badge className="bg-yellow-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Best Sellers
                      </Badge>
                      <Badge className="bg-orange-500 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Product Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              showFilters={true}
              showSearch={true}
              showViewToggle={true}
              itemsPerPage={12}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Bottom CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Ready to Start Your Beauty Business?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of retailers who trust Shubham Enterprises for their cosmetics wholesale needs. 
              Get access to exclusive products, better margins, and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Become a Reseller
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}