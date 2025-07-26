'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Star, 
  Sparkles, 
  Heart,
  ShoppingBag,
  ArrowRight,
  Users,
  Award,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const floatingElements = [
  { icon: Sparkles, delay: 0, x: '10%', y: '20%', size: 'w-8 h-8' },
  { icon: Heart, delay: 0.5, x: '80%', y: '30%', size: 'w-6 h-6' },
  { icon: Star, delay: 1, x: '15%', y: '70%', size: 'w-7 h-7' },
  { icon: Zap, delay: 1.5, x: '85%', y: '60%', size: 'w-5 h-5' },
  { icon: Award, delay: 2, x: '70%', y: '15%', size: 'w-6 h-6' },
]

const stats = [
  { label: 'Happy Customers', value: '50K+', icon: Users },
  { label: 'Premium Products', value: '1000+', icon: ShoppingBag },
  { label: 'Years Experience', value: '10+', icon: Award },
  { label: 'Success Rate', value: '99%', icon: Star },
]

export default function HeroDisney() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-disney">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
      
      {/* Floating Elements */}
      {floatingElements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className={`absolute ${element.size} text-white/30`}
            style={{ left: element.x, top: element.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3], 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        )
      })}
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="glass-disney text-white border-white/30 px-4 py-2 text-sm font-medium">
                ✨ Premium Beauty Collection
              </Badge>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight"
            >
              <span className="block">Transform Your</span>
              <span className="block text-shimmer">Beauty Business</span>
            </motion.h1>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Discover premium cosmetics and beauty products with wholesale pricing. 
              Join thousands of successful retailers and transform your business today.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link href="/shop">
                <Button className="btn-disney group px-8 py-4 text-lg">
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="glass-hero text-white border-white/30 hover:bg-white/20 px-8 py-4 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="glass-disney p-4 rounded-xl text-center hover-disney"
                  >
                    <Icon className="w-6 h-6 text-white/80 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
          
          {/* Right Content - Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Product Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="card-floating p-8 max-w-md mx-auto"
            >
              <div className="relative mb-6">
                <div className="w-full h-64 bg-gradient-glass rounded-2xl flex items-center justify-center">
                  <div className="text-6xl animate-float">💄</div>
                </div>
                <Badge className="absolute top-4 right-4 bg-accent text-white border-0">
                  New
                </Badge>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Premium Collection
                </h3>
                <p className="text-white/80 mb-4">
                  Discover our latest beauty essentials with exclusive wholesale pricing.
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-white/80 text-sm ml-2">4.9</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 line-through text-sm">₹2,999</div>
                    <div className="text-white font-bold text-xl">₹1,999</div>
                  </div>
                </div>
                
                <Button className="btn-glass w-full">
                  Add to Cart
                </Button>
              </div>
            </motion.div>
            
            {/* Floating Mini Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -top-8 -left-8 glass-disney p-4 rounded-xl animate-float"
              style={{ animationDelay: '1s' }}
            >
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-white text-sm font-medium">Best Seller</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="absolute -bottom-8 -right-8 glass-disney p-4 rounded-xl animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="text-2xl mb-2">🚚</div>
              <div className="text-white text-sm font-medium">Free Delivery</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}