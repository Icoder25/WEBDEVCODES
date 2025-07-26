'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Percent,
  IndianRupee,
  MessageCircle,
  Download,
  Star,
  Shield,
  Truck,
  HeadphonesIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

// Form validation schema
const resellerSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  
  // Business Information
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['retail_store', 'salon', 'spa', 'online_store', 'distributor', 'other']),
  gstNumber: z.string().optional(),
  businessAddress: z.string().min(10, 'Business address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  
  // Business Details
  yearsInBusiness: z.string(),
  monthlyVolume: z.string(),
  currentSuppliers: z.string().optional(),
  targetCategories: z.array(z.string()).min(1, 'Select at least one category'),
  
  // Additional Information
  hearAboutUs: z.string(),
  additionalInfo: z.string().optional(),
  
  // Agreements
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
  agreeMarketing: z.boolean().optional()
})

type ResellerFormData = z.infer<typeof resellerSchema>

const businessTypes = [
  { value: 'retail_store', label: 'Retail Store' },
  { value: 'salon', label: 'Beauty Salon' },
  { value: 'spa', label: 'Spa & Wellness' },
  { value: 'online_store', label: 'Online Store' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'other', label: 'Other' }
]

const categories = [
  'Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Men\'s Grooming', 'Body Care'
]

const monthlyVolumes = [
  { value: '0-50k', label: '₹0 - ₹50,000' },
  { value: '50k-1l', label: '₹50,000 - ₹1,00,000' },
  { value: '1l-5l', label: '₹1,00,000 - ₹5,00,000' },
  { value: '5l-10l', label: '₹5,00,000 - ₹10,00,000' },
  { value: '10l+', label: '₹10,00,000+' }
]

const benefits = [
  {
    icon: Percent,
    title: 'Up to 40% Margins',
    description: 'Competitive wholesale pricing with attractive profit margins'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick dispatch and reliable delivery across India'
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: '100% authentic products with quality guarantee'
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Personal account manager and 24/7 customer support'
  },
  {
    icon: Award,
    title: 'Exclusive Products',
    description: 'Access to premium brands and exclusive product lines'
  },
  {
    icon: TrendingUp,
    title: 'Business Growth',
    description: 'Marketing support and business development assistance'
  }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    business: 'Beauty Palace, Mumbai',
    rating: 5,
    text: 'Shubham Enterprises has been our trusted partner for 3 years. Excellent products and service!'
  },
  {
    name: 'Rajesh Kumar',
    business: 'Glow Salon, Delhi',
    rating: 5,
    text: 'Amazing margins and fast delivery. Our customers love the product quality.'
  },
  {
    name: 'Meera Patel',
    business: 'Online Beauty Store',
    rating: 5,
    text: 'The support team is fantastic. They helped us grow our business significantly.'
  }
]

export default function ResellerPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [calculatorData, setCalculatorData] = useState({
    productPrice: 1000,
    quantity: 10,
    margin: 25
  })
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<ResellerFormData>({
    resolver: zodResolver(resellerSchema),
    defaultValues: {
      targetCategories: [],
      agreeTerms: false,
      agreeMarketing: false
    }
  })
  
  const watchedCategories = watch('targetCategories') || []
  
  const onSubmit = async (data: ResellerFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Reseller application:', data)
      toast.success('Application submitted successfully! We\'ll contact you within 24 hours.')
      
      // Reset form or redirect
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }
  
  const handleCategoryToggle = (category: string) => {
    const current = watchedCategories
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    setValue('targetCategories', updated)
  }
  
  // Margin Calculator
  const calculateProfit = () => {
    const { productPrice, quantity, margin } = calculatorData
    const costPrice = productPrice
    const sellingPrice = costPrice * (1 + margin / 100)
    const totalCost = costPrice * quantity
    const totalRevenue = sellingPrice * quantity
    const totalProfit = totalRevenue - totalCost
    
    return {
      costPrice,
      sellingPrice,
      totalCost,
      totalRevenue,
      totalProfit,
      profitPerUnit: totalProfit / quantity
    }
  }
  
  const calculations = calculateProfit()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Become a Reseller
              <span className="block text-primary-100">Grow Your Beauty Business</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join our network of successful beauty retailers and unlock exclusive wholesale prices, 
              premium products, and dedicated business support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Join 5000+ Resellers
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Margins
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Why Choose Shubham Enterprises?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in the beauty business
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Margin Calculator */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Profit Margin Calculator
              </h2>
              <p className="text-xl text-gray-600">
                Calculate your potential profits with our wholesale pricing
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calculator Inputs */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Enter Your Details
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Cost Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={calculatorData.productPrice}
                        onChange={(e) => setCalculatorData(prev => ({
                          ...prev,
                          productPrice: Number(e.target.value)
                        }))}
                        className="text-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        value={calculatorData.quantity}
                        onChange={(e) => setCalculatorData(prev => ({
                          ...prev,
                          quantity: Number(e.target.value)
                        }))}
                        className="text-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Desired Margin (%)
                      </label>
                      <Input
                        type="number"
                        value={calculatorData.margin}
                        onChange={(e) => setCalculatorData(prev => ({
                          ...prev,
                          margin: Number(e.target.value)
                        }))}
                        className="text-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Calculator Results */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Profit Calculation
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cost Price per Unit:</span>
                        <span className="font-semibold">{formatPrice(calculations.costPrice)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Selling Price per Unit:</span>
                        <span className="font-semibold text-green-600">{formatPrice(calculations.sellingPrice)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Profit per Unit:</span>
                        <span className="font-semibold text-green-600">{formatPrice(calculations.profitPerUnit)}</span>
                      </div>
                      
                      <hr className="border-gray-300" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Investment:</span>
                        <span className="font-semibold">{formatPrice(calculations.totalCost)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-semibold text-green-600">{formatPrice(calculations.totalRevenue)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold text-gray-900">Total Profit:</span>
                        <span className="font-bold text-green-600">{formatPrice(calculations.totalProfit)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-semibold">
                          {calculatorData.margin}% Profit Margin
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Application Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Reseller Application Form
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below to start your journey with us
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                        required
                      />
                      <Input
                        label="Last Name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        required
                        leftIcon={Mail}
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
                        required
                        leftIcon={Phone}
                      />
                    </div>
                  </div>
                  
                  {/* Business Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Business Name"
                        {...register('businessName')}
                        error={errors.businessName?.message}
                        required
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          {...register('businessType')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select business type</option>
                          {businessTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {errors.businessType && (
                          <p className="text-red-600 text-sm mt-1">{errors.businessType.message}</p>
                        )}
                      </div>
                      
                      <Input
                        label="GST Number (Optional)"
                        {...register('gstNumber')}
                        placeholder="22AAAAA0000A1Z5"
                      />
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Input
                            label="Business Address"
                            {...register('businessAddress')}
                            error={errors.businessAddress?.message}
                            required
                            leftIcon={MapPin}
                          />
                        </div>
                        <Input
                          label="City"
                          {...register('city')}
                          error={errors.city?.message}
                          required
                        />
                        <Input
                          label="State"
                          {...register('state')}
                          error={errors.state?.message}
                          required
                        />
                        <Input
                          label="Pincode"
                          {...register('pincode')}
                          error={errors.pincode?.message}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Business Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Business Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years in Business
                          </label>
                          <select
                            {...register('yearsInBusiness')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Select years</option>
                            <option value="new">New Business</option>
                            <option value="1-2">1-2 years</option>
                            <option value="3-5">3-5 years</option>
                            <option value="5+">5+ years</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expected Monthly Volume
                          </label>
                          <select
                            {...register('monthlyVolume')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Select volume</option>
                            {monthlyVolumes.map(volume => (
                              <option key={volume.value} value={volume.value}>
                                {volume.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <Input
                        label="Current Suppliers (Optional)"
                        {...register('currentSuppliers')}
                        placeholder="List your current cosmetics suppliers"
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Product Categories *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {categories.map(category => (
                            <label key={category} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={watchedCategories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm">{category}</span>
                            </label>
                          ))}
                        </div>
                        {errors.targetCategories && (
                          <p className="text-red-600 text-sm mt-1">{errors.targetCategories.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How did you hear about us?
                        </label>
                        <select
                          {...register('hearAboutUs')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select option</option>
                          <option value="google">Google Search</option>
                          <option value="social_media">Social Media</option>
                          <option value="referral">Referral</option>
                          <option value="trade_show">Trade Show</option>
                          <option value="advertisement">Advertisement</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Information (Optional)
                        </label>
                        <textarea
                          {...register('additionalInfo')}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Tell us more about your business goals, special requirements, etc."
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Agreements */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('agreeTerms')}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary-600 hover:underline">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary-600 hover:underline">
                          Privacy Policy
                        </a>
                        *
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-red-600 text-sm">{errors.agreeTerms.message}</p>
                    )}
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('agreeMarketing')}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to receive marketing communications and updates about new products and offers
                      </span>
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {isSubmitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Support
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              What Our Resellers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful beauty entrepreneurs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.business}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Start Your Success Story?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join our reseller network today and unlock unlimited growth potential in the beauty industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Download className="w-5 h-5 mr-2" />
                Download Catalog
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}