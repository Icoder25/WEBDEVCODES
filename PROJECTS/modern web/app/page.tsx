'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowRight, 
  Star, 
  Users, 
  ShoppingBag, 
  Award, 
  Shield, 
  Truck, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  TrendingUp,
  Heart,
  Zap,
  Sparkles,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import HeroDisney from '@/components/sections/hero-disney'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const features = [
  {
    icon: Package,
    title: 'Premium Quality',
    description: 'Authentic cosmetics from trusted brands with quality assurance'
  },
  {
    icon: Users,
    title: 'B2B Wholesale',
    description: 'Competitive pricing for retailers and resellers with tiered discounts'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Nationwide shipping with tracking and timely delivery'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Multiple payment options including UPI and credit terms'
  }
]

const stats = [
  { number: '5000+', label: 'Products' },
  { number: '1000+', label: 'Happy Clients' },
  { number: '50+', label: 'Brands' },
  { number: '99%', label: 'Satisfaction' }
]

const testimonials = [
  {
    name: 'Rajesh Kumar',
    business: 'Beauty Palace, Mumbai',
    rating: 5,
    comment: 'Excellent quality products and competitive prices. Shubham Enterprises has been our trusted partner for 3 years.'
  },
  {
    name: 'Priya Sharma',
    business: 'Glamour Store, Delhi',
    rating: 5,
    comment: 'Fast delivery and genuine products. Their customer service is outstanding and always helpful.'
  },
  {
    name: 'Amit Patel',
    business: 'Cosmetic Corner, Ahmedabad',
    rating: 5,
    comment: 'Great margins for resellers and consistent stock availability. Highly recommend for B2B purchases.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Disney-Inspired Hero Section */}
      <HeroDisney />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive solutions for your cosmetics business with unmatched quality and service.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover-lift glass-card border-0">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by retailers and resellers across India for quality and reliability.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover-lift">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.business}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of successful retailers who trust Shubham Enterprises for their cosmetics wholesale needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-white/90"
                asChild
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              
              <Button 
                size="xl" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600"
                asChild
              >
                <Link href="/catalog">
                  <Package className="mr-2 h-5 w-5" />
                  View Catalog
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <Phone className="h-8 w-8 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+91 98765 43210</p>
              <p className="text-gray-300">+91 87654 32109</p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <Mail className="h-8 w-8 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@shubhamenterprises.com</p>
              <p className="text-gray-300">orders@shubhamenterprises.com</p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <MapPin className="h-8 w-8 text-primary-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">123 Business District</p>
              <p className="text-gray-300">Mumbai, Maharashtra 400001</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}