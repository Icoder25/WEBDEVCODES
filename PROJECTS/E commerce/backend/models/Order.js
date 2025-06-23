const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order identification
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Customer information
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  
  // Order details
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be greater than 0'],
    max: [1000000, 'Amount cannot exceed 10 lakhs']
  },
  
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR']
  },
  
  // Order items (optional - can be expanded)
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  
  // Payment status
  status: {
    type: String,
    enum: ['initiated', 'pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'initiated',
    index: true
  },
  
  // Cashfree specific fields
  cashfreeOrderId: {
    type: String,
    sparse: true,
    index: true
  },
  
  paymentSessionId: {
    type: String,
    sparse: true,
    index: true
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet'],
    default: 'upi'
  },
  
  paymentApp: {
    type: String,
    enum: ['phonepe', 'googlepay', 'paytm', 'bhim', 'other']
  },
  
  // Transaction details
  transactionId: {
    type: String,
    sparse: true,
    index: true
  },
  
  bankReference: {
    type: String,
    sparse: true
  },
  
  // UPI details
  upiTransactionId: {
    type: String,
    sparse: true
  },
  
  // Timestamps
  paymentInitiatedAt: {
    type: Date
  },
  
  paymentCompletedAt: {
    type: Date
  },
  
  // Delivery information
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  deliveryType: {
    type: String,
    enum: ['standard', 'express'],
    default: 'standard'
  },
  
  // Business information
  businessType: {
    type: String,
    enum: ['salon', 'spa', 'retailer', 'distributor', 'other']
  },
  
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  
  // Additional fields
  notes: {
    type: String,
    maxlength: 500
  },
  
  // Webhook and callback URLs
  returnUrl: String,
  notifyUrl: String,
  
  // Error tracking
  errorMessage: String,
  errorCode: String,
  
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: { type: String, default: 'web' }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ email: 1, createdAt: -1 });
orderSchema.index({ phone: 1, createdAt: -1 });

// Virtual for formatted amount
orderSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware
orderSchema.pre('save', function(next) {
  // Set payment initiated timestamp
  if (this.isNew) {
    this.paymentInitiatedAt = new Date();
  }
  
  // Set payment completed timestamp when status changes to paid
  if (this.isModified('status') && this.status === 'paid' && !this.paymentCompletedAt) {
    this.paymentCompletedAt = new Date();
  }
  
  next();
});

// Static methods
orderSchema.statics.findByOrderId = function(orderId) {
  return this.findOne({ orderId });
};

orderSchema.statics.findByCashfreeOrderId = function(cashfreeOrderId) {
  return this.findOne({ cashfreeOrderId });
};

orderSchema.statics.findByPaymentSessionId = function(paymentSessionId) {
  return this.findOne({ paymentSessionId });
};

// Instance methods
orderSchema.methods.markAsPaid = function(transactionDetails = {}) {
  this.status = 'paid';
  this.paymentCompletedAt = new Date();
  
  if (transactionDetails.transactionId) {
    this.transactionId = transactionDetails.transactionId;
  }
  
  if (transactionDetails.bankReference) {
    this.bankReference = transactionDetails.bankReference;
  }
  
  if (transactionDetails.upiTransactionId) {
    this.upiTransactionId = transactionDetails.upiTransactionId;
  }
  
  return this.save();
};

orderSchema.methods.markAsFailed = function(errorMessage, errorCode) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  this.errorCode = errorCode;
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);