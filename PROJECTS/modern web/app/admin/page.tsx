'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  MoreHorizontal,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { Product, Order, User } from '@/types'

// Mock data for demonstration
const mockStats = {
  totalRevenue: 2450000,
  totalOrders: 1234,
  totalProducts: 456,
  totalUsers: 2890,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  productsGrowth: 15.2,
  usersGrowth: 22.1
}

const mockRecentOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user1',
    items: [],
    total: 15000,
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 9876543210',
      email: 'priya@example.com',
      addressLine1: '123 Beauty Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    paymentMethod: 'upi',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD-002',
    userId: 'user2',
    items: [],
    total: 25000,
    status: 'processing',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    shippingAddress: {
      fullName: 'Rajesh Kumar',
      phone: '+91 9876543211',
      email: 'rajesh@example.com',
      addressLine1: '456 Salon Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    paymentMethod: 'credit',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-003',
    userId: 'user3',
    items: [],
    total: 8500,
    status: 'shipped',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    shippingAddress: {
      fullName: 'Meera Patel',
      phone: '+91 9876543212',
      email: 'meera@example.com',
      addressLine1: '789 Spa Complex',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid'
  }
]

const mockTopProducts = [
  { id: '1', name: 'Premium Face Cream', sales: 245, revenue: 122500 },
  { id: '2', name: 'Luxury Lipstick Set', sales: 189, revenue: 94500 },
  { id: '3', name: 'Anti-Aging Serum', sales: 156, revenue: 156000 },
  { id: '4', name: 'Hair Growth Oil', sales: 134, revenue: 67000 },
  { id: '5', name: 'Moisturizing Lotion', sales: 98, revenue: 49000 }
]

const mockRecentUsers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', role: 'reseller', joinDate: '2024-01-15', status: 'active' },
  { id: '2', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'customer', joinDate: '2024-01-14', status: 'active' },
  { id: '3', name: 'Meera Patel', email: 'meera@example.com', role: 'reseller', joinDate: '2024-01-13', status: 'pending' },
  { id: '4', name: 'Amit Singh', email: 'amit@example.com', role: 'customer', joinDate: '2024-01-12', status: 'active' },
  { id: '5', name: 'Sunita Devi', email: 'sunita@example.com', role: 'reseller', joinDate: '2024-01-11', status: 'active' }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'processing':
      return <RefreshCw className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <XCircle className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'processing':
      return 'info'
    case 'shipped':
      return 'default'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getUserRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'destructive'
    case 'reseller':
      return 'default'
    case 'customer':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getUserStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'pending':
      return 'warning'
    case 'suspended':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('7d')
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce platform</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@shubhamenterprises.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-4 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(mockStats.totalRevenue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{mockStats.revenueGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{mockStats.ordersGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{mockStats.productsGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{mockStats.usersGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Orders & Top Products */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Orders</span>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.shippingAddress.fullName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                          <Badge variant={getStatusColor(order.status)} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Top Products</span>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTopProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sales} sales</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Users</span>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getUserRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getUserStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {formatDate(new Date(user.joinDate))}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Orders Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
                <p className="text-gray-600">Manage and track all customer orders</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search orders by ID, customer name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={Search}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Order ID</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Customer</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Total</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Payment</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <span className="font-medium text-primary-600">{order.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                              <p className="text-sm text-gray-500">{order.shippingAddress.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1 w-fit">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                              {order.paymentStatus}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Products Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
            
            {/* Coming Soon Placeholder */}
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Products Management</h3>
                <p className="text-gray-600 mb-6">Advanced product management features coming soon</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Users Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                <p className="text-gray-600">Manage customers, resellers, and admin users</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            
            {/* Coming Soon Placeholder */}
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Users Management</h3>
                <p className="text-gray-600 mb-6">Comprehensive user management features coming soon</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Analytics Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                <p className="text-gray-600">Detailed insights and performance metrics</p>
              </div>
              <div className="flex gap-2">
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
            
            {/* Coming Soon Placeholder */}
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-gray-600 mb-6">Detailed charts, reports, and business insights coming soon</p>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Sample Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}