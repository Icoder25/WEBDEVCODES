const Joi = require('joi');

// Validation schemas
const schemas = {
  createOrder: Joi.object({
    orderId: Joi.string().required().min(3).max(50).pattern(/^[A-Za-z0-9_-]+$/),
    amount: Joi.number().required().min(1).max(1000000),
    customerName: Joi.string().required().min(2).max(100).trim(),
    phone: Joi.string().required().pattern(/^[6-9]\d{9}$/),
    email: Joi.string().required().email().lowercase(),
    businessType: Joi.string().valid('salon', 'spa', 'retailer', 'distributor', 'other'),
    gstin: Joi.string().optional().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
    deliveryType: Joi.string().valid('standard', 'express').default('standard'),
    paymentMethod: Joi.string().valid('upi', 'card', 'netbanking', 'wallet').default('upi'),
    paymentApp: Joi.string().valid('phonepe', 'googlepay', 'paytm', 'bhim', 'other').optional(),
    shippingAddress: Joi.object({
      street: Joi.string().required().min(5).max(200),
      city: Joi.string().required().min(2).max(50),
      state: Joi.string().required().min(2).max(50),
      pincode: Joi.string().required().pattern(/^[1-9][0-9]{5}$/),
      country: Joi.string().default('India')
    }).optional(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required().min(1).max(200),
        quantity: Joi.number().required().min(1).max(1000),
        price: Joi.number().required().min(0),
        total: Joi.number().required().min(0)
      })
    ).optional(),
    notes: Joi.string().optional().max(500),
    returnUrl: Joi.string().uri().optional(),
    notifyUrl: Joi.string().uri().optional(),
    metadata: Joi.object({
      userAgent: Joi.string().optional(),
      ipAddress: Joi.string().ip().optional(),
      source: Joi.string().default('web')
    }).optional()
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string().valid('initiated', 'pending', 'paid', 'failed', 'cancelled', 'refunded').required(),
    transactionId: Joi.string().optional(),
    bankReference: Joi.string().optional(),
    upiTransactionId: Joi.string().optional(),
    errorMessage: Joi.string().optional(),
    errorCode: Joi.string().optional()
  }),

  getOrderStatus: Joi.object({
    orderId: Joi.string().required().min(3).max(50)
  }),

  webhookPayload: Joi.object({
    type: Joi.string().required(),
    order: Joi.object().required(),
    payment: Joi.object().optional()
  }).unknown(true) // Allow additional fields
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      console.log('❌ Validation error:', {
        endpoint: req.originalUrl,
        method: req.method,
        errors: errorDetails
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails
      });
    }

    // Replace the request property with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Phone number validation helper
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Email validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// GSTIN validation helper
const validateGSTIN = (gstin) => {
  if (!gstin) return true; // Optional field
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

// Amount validation helper
const validateAmount = (amount) => {
  return typeof amount === 'number' && amount > 0 && amount <= 1000000;
};

// Order ID validation helper
const validateOrderId = (orderId) => {
  const orderIdRegex = /^[A-Za-z0-9_-]+$/;
  return typeof orderId === 'string' && 
         orderId.length >= 3 && 
         orderId.length <= 50 && 
         orderIdRegex.test(orderId);
};

// Sanitize input helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>"'&]/g, '');
  }
  return input;
};

// Custom validation middleware for specific use cases
const customValidation = {
  // Validate order creation with business logic
  validateOrderCreation: (req, res, next) => {
    const { amount, items } = req.body;
    
    // If items are provided, validate total amount matches
    if (items && items.length > 0) {
      const calculatedTotal = items.reduce((sum, item) => sum + item.total, 0);
      if (Math.abs(calculatedTotal - amount) > 0.01) {
        return res.status(400).json({
          success: false,
          message: 'Order amount does not match items total',
          calculated: calculatedTotal,
          provided: amount
        });
      }
    }
    
    next();
  },

  // Validate payment session creation
  validatePaymentSession: (req, res, next) => {
    const { orderId, amount } = req.body;
    
    // Additional business logic validation
    if (amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum order amount is ₹10'
      });
    }
    
    next();
  }
};

module.exports = {
  validate,
  schemas,
  customValidation,
  helpers: {
    validatePhoneNumber,
    validateEmail,
    validateGSTIN,
    validateAmount,
    validateOrderId,
    sanitizeInput
  }
};