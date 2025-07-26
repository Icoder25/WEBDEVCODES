'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Building,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Shield,
  Users,
  Crown,
  Store
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

// Form validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  accountType: z.enum(['customer', 'reseller']),
  businessName: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
  agreeMarketing: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine((data) => {
  if (data.accountType === 'reseller' && !data.businessName) {
    return false
  }
  return true
}, {
  message: "Business name is required for reseller accounts",
  path: ["businessName"]
})

type RegisterFormData = z.infer<typeof registerSchema>

const accountTypes = [
  {
    id: 'customer',
    title: 'Customer Account',
    description: 'Perfect for personal purchases and small orders',
    icon: User,
    features: [
      'Browse premium products',
      'Secure checkout process',
      'Order tracking',
      'Customer support'
    ],
    badge: 'Popular'
  },
  {
    id: 'reseller',
    title: 'Reseller Account',
    description: 'Ideal for businesses and bulk purchases',
    icon: Store,
    features: [
      'Wholesale pricing',
      'Bulk order discounts',
      'Business dashboard',
      'Dedicated support'
    ],
    badge: 'Business'
  }
]

const benefits = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: '100% authentic products from trusted brands'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your data is protected with bank-level security'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: '24/7 customer support from beauty experts'
  }
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: 'customer',
      agreeTerms: false,
      agreeMarketing: false
    }
  })
  
  const watchedAccountType = watch('accountType')
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.accountType,
        businessName: data.businessName
      })
      toast.success('Account created successfully! Welcome to Shubham Enterprises.')
      // Redirect will be handled by the auth store
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Join <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Shubham Enterprises
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your account and start your journey with India's leading cosmetics platform
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl p-6 text-white">
              <Crown className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">Premium Membership</h3>
              <p className="text-primary-100 text-sm mb-4">
                Unlock exclusive benefits and wholesale pricing with our reseller program.
              </p>
              <Link href="/reseller">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Center - Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </CardTitle>
                <p className="text-gray-600">
                  Fill in your details to get started
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Account Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Account Type
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {accountTypes.map((type) => {
                        const Icon = type.icon
                        const isSelected = watchedAccountType === type.id
                        return (
                          <div
                            key={type.id}
                            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setValue('accountType', type.id as 'customer' | 'reseller')}
                          >
                            <input
                              type="radio"
                              {...register('accountType')}
                              value={type.id}
                              className="sr-only"
                            />
                            
                            {type.badge && (
                              <Badge 
                                variant={type.id === 'customer' ? 'default' : 'secondary'} 
                                className="absolute top-2 right-2 text-xs"
                              >
                                {type.badge}
                              </Badge>
                            )}
                            
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {type.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                  {type.description}
                                </p>
                                <ul className="space-y-1">
                                  {type.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                        required
                      />
                      <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                        error={errors.email?.message}
                        leftIcon={Mail}
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        {...register('phone')}
                        error={errors.phone?.message}
                        leftIcon={Phone}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Business Information (for resellers) */}
                  {watchedAccountType === 'reseller' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Business Information
                      </h3>
                      <Input
                        label="Business Name"
                        placeholder="Enter your business name"
                        {...register('businessName')}
                        error={errors.businessName?.message}
                        leftIcon={Building}
                        required
                      />
                    </motion.div>
                  )}
                  
                  {/* Password */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Security
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        {...register('password')}
                        error={errors.password?.message}
                        leftIcon={Lock}
                        rightIcon={showPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        required
                      />
                      <Input
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        leftIcon={Lock}
                        rightIcon={showConfirmPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        required
                      />
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
                        <Link href="/terms" className="text-primary-600 hover:underline font-medium">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary-600 hover:underline font-medium">
                          Privacy Policy
                        </Link>
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
                        I would like to receive marketing emails about new products, offers, and updates
                      </span>
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold py-3 text-base"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>
                
                {/* Social Registration */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
                
                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      href="/login" 
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Mobile Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:hidden mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}