const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const cashfreeService = require('../services/cashfreeService');
const { validate, schemas, customValidation } = require('../middleware/validation');

/**
 * @route POST /api/cashfree/pay
 * @desc Create a payment session with Cashfree
 * @access Public
 */
router.post('/pay', 
  validate(schemas.createOrder),
  customValidation.validateOrderCreation,
  customValidation.validatePaymentSession,
  async (req, res) => {
    try {
      const {
        orderId,
        amount,
        customerName,
        phone,
        email,
        businessType,
        gstin,
        deliveryType,
        paymentMethod,
        paymentApp,
        shippingAddress,
        items,
        notes,
        returnUrl,
        notifyUrl,
        metadata
      } = req.body;

      console.log('🔄 Creating payment session for order:', {
        orderId,
        amount,
        customer: customerName,
        email,
        phone
      });

      // Check if order already exists
      const existingOrder = await Order.findByOrderId(orderId);
      if (existingOrder) {
        console.log('⚠️ Order already exists:', orderId);
        
        // If order is already paid, return error
        if (existingOrder.status === 'paid') {
          return res.status(400).json({
            success: false,
            message: 'Order has already been paid',
            orderId,
            status: existingOrder.status
          });
        }
        
        // If order is in progress, return existing session
        if (existingOrder.paymentSessionId && existingOrder.status === 'initiated') {
          return res.status(200).json({
            success: true,
            message: 'Payment session already exists',
            orderId,
            paymentSessionId: existingOrder.paymentSessionId,
            cashfreeOrderId: existingOrder.cashfreeOrderId,
            upiLink: cashfreeService.generateUpiLink(amount, orderId),
            qrCodeData: cashfreeService.generateQrCodeData(amount, orderId)
          });
        }
      }

      // Create payment session with Cashfree
      const paymentSession = await cashfreeService.createPaymentSession({
        orderId,
        amount,
        customerName,
        email,
        phone,
        returnUrl,
        notifyUrl
      });

      if (!paymentSession.success) {
        console.error('❌ Failed to create Cashfree payment session:', paymentSession.error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create payment session',
          error: paymentSession.error
        });
      }

      // Create or update order in database
      let order;
      if (existingOrder) {
        // Update existing order
        existingOrder.amount = amount;
        existingOrder.customerName = customerName;
        existingOrder.phone = phone;
        existingOrder.email = email;
        existingOrder.businessType = businessType;
        existingOrder.gstin = gstin;
        existingOrder.deliveryType = deliveryType;
        existingOrder.paymentMethod = paymentMethod;
        existingOrder.paymentApp = paymentApp;
        existingOrder.shippingAddress = shippingAddress;
        existingOrder.items = items;
        existingOrder.notes = notes;
        existingOrder.cashfreeOrderId = paymentSession.cashfreeOrderId;
        existingOrder.paymentSessionId = paymentSession.paymentSessionId;
        existingOrder.returnUrl = returnUrl;
        existingOrder.notifyUrl = notifyUrl;
        existingOrder.metadata = metadata;
        existingOrder.status = 'initiated';
        
        order = await existingOrder.save();
      } else {
        // Create new order
        order = new Order({
          orderId,
          amount,
          customerName,
          phone,
          email,
          businessType,
          gstin,
          deliveryType,
          paymentMethod,
          paymentApp,
          shippingAddress,
          items,
          notes,
          cashfreeOrderId: paymentSession.cashfreeOrderId,
          paymentSessionId: paymentSession.paymentSessionId,
          returnUrl,
          notifyUrl,
          metadata,
          status: 'initiated'
        });
        
        order = await order.save();
      }

      console.log('✅ Order created/updated successfully:', {
        orderId: order.orderId,
        cashfreeOrderId: order.cashfreeOrderId,
        paymentSessionId: order.paymentSessionId
      });

      // Generate UPI fallback link and QR code data
      const upiLink = cashfreeService.generateUpiLink(amount, orderId);
      const qrCodeData = cashfreeService.generateQrCodeData(amount, orderId);

      res.status(201).json({
        success: true,
        message: 'Payment session created successfully',
        data: {
          orderId: order.orderId,
          cashfreeOrderId: order.cashfreeOrderId,
          paymentSessionId: order.paymentSessionId,
          paymentUrl: paymentSession.paymentUrl,
          orderToken: paymentSession.orderToken,
          amount: order.formattedAmount,
          upiLink,
          qrCodeData,
          customer: {
            name: order.customerName,
            email: order.email,
            phone: order.phone
          },
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        }
      });

    } catch (error) {
      console.error('❌ Error in payment session creation:', {
        message: error.message,
        stack: error.stack
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
);

/**
 * @route GET /api/cashfree/status/:orderId
 * @desc Get payment status for an order
 * @access Public
 */
router.get('/status/:orderId', 
  validate(schemas.getOrderStatus, 'params'),
  async (req, res) => {
    try {
      const { orderId } = req.params;

      console.log('🔄 Checking payment status for order:', orderId);

      // Find order in database
      const order = await Order.findByOrderId(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          orderId
        });
      }

      // If order doesn't have Cashfree order ID, return current status
      if (!order.cashfreeOrderId) {
        return res.status(200).json({
          success: true,
          data: {
            orderId: order.orderId,
            status: order.status,
            amount: order.formattedAmount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
          }
        });
      }

      // Get status from Cashfree
      const paymentStatus = await cashfreeService.getPaymentStatus(order.cashfreeOrderId);
      
      if (paymentStatus.success) {
        // Update order status if it has changed
        let statusChanged = false;
        
        if (paymentStatus.status === 'PAID' && order.status !== 'paid') {
          // Get payment details for transaction info
          const paymentDetails = await cashfreeService.getPaymentDetails(order.cashfreeOrderId);
          
          if (paymentDetails.success) {
            await order.markAsPaid({
              transactionId: paymentDetails.transactionId,
              bankReference: paymentDetails.bankReference,
              upiTransactionId: paymentDetails.upiTransactionId
            });
            statusChanged = true;
          }
        } else if (paymentStatus.status === 'FAILED' && order.status !== 'failed') {
          await order.markAsFailed('Payment failed', 'PAYMENT_FAILED');
          statusChanged = true;
        }

        if (statusChanged) {
          console.log('✅ Order status updated:', {
            orderId: order.orderId,
            oldStatus: order.status,
            newStatus: paymentStatus.status
          });
        }
      }

      res.status(200).json({
        success: true,
        data: {
          orderId: order.orderId,
          status: order.status,
          amount: order.formattedAmount,
          cashfreeStatus: paymentStatus.success ? paymentStatus.status : null,
          transactionId: order.transactionId,
          paymentCompletedAt: order.paymentCompletedAt,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Error checking payment status:', {
        orderId: req.params.orderId,
        message: error.message,
        stack: error.stack
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
);

/**
 * @route GET /api/cashfree/upi-link/:orderId
 * @desc Generate UPI link for fallback payment
 * @access Public
 */
router.get('/upi-link/:orderId', 
  validate(schemas.getOrderStatus, 'params'),
  async (req, res) => {
    try {
      const { orderId } = req.params;

      // Find order in database
      const order = await Order.findByOrderId(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          orderId
        });
      }

      // Generate UPI link
      const upiLink = cashfreeService.generateUpiLink(order.amount, orderId);
      const qrCodeData = cashfreeService.generateQrCodeData(order.amount, orderId);

      res.status(200).json({
        success: true,
        data: {
          orderId: order.orderId,
          amount: order.formattedAmount,
          upiLink,
          qrCodeData,
          merchantName: 'Shubham Enterprise',
          upiId: process.env.UPI_ID || 'yourupiid@okaxis'
        }
      });

    } catch (error) {
      console.error('❌ Error generating UPI link:', {
        orderId: req.params.orderId,
        message: error.message
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
);

module.exports = router;