const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const CashfreeService = require('../services/cashfreeService');
const { validate, schemas } = require('../middleware/validation');

// Initialize Cashfree service
const cashfreeService = new CashfreeService();

/**
 * @route POST /api/webhooks/cashfree
 * @desc Handle Cashfree payment webhooks
 * @access Public (Cashfree servers)
 */
router.post('/cashfree', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const signature = req.headers['x-webhook-signature'];
      const timestamp = req.headers['x-webhook-timestamp'];
      const rawBody = req.body;

      console.log('📨 Received Cashfree webhook:', {
        signature: signature ? 'Present' : 'Missing',
        timestamp,
        bodyLength: rawBody ? rawBody.length : 0
      });

      // Verify webhook signature
      if (!signature || !timestamp) {
        console.warn('⚠️ Missing webhook signature or timestamp');
        return res.status(400).json({
          success: false,
          message: 'Missing required webhook headers'
        });
      }

      // Parse the body
      let webhookData;
      try {
        webhookData = JSON.parse(rawBody.toString());
      } catch (parseError) {
        console.error('❌ Failed to parse webhook body:', parseError.message);
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON payload'
        });
      }

      // Verify signature
      const isValidSignature = cashfreeService.verifyWebhookSignature(
        rawBody.toString(),
        signature,
        timestamp
      );

      if (!isValidSignature) {
        console.warn('⚠️ Invalid webhook signature');
        return res.status(401).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }

      console.log('✅ Webhook signature verified');

      // Extract payment data
      const {
        type,
        data: paymentData
      } = webhookData;

      if (!paymentData || !paymentData.order) {
        console.warn('⚠️ Invalid webhook payload structure');
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook payload'
        });
      }

      const {
        order_id: cashfreeOrderId,
        order_amount: amount,
        order_currency: currency,
        payment_session_id: paymentSessionId,
        order_status: orderStatus,
        payment_completion_time: completionTime,
        order_note: orderNote
      } = paymentData.order;

      const paymentInfo = paymentData.payment || {};
      const {
        cf_payment_id: transactionId,
        payment_status: paymentStatus,
        payment_amount: paidAmount,
        payment_currency: paidCurrency,
        payment_message: paymentMessage,
        payment_time: paymentTime,
        bank_reference: bankReference,
        auth_id: authId,
        payment_method: paymentMethodData
      } = paymentInfo;

      console.log('📋 Processing webhook:', {
        type,
        cashfreeOrderId,
        orderStatus,
        paymentStatus,
        amount: paidAmount || amount
      });

      // Find the order in our database
      const order = await Order.findOne({ cashfreeOrderId });
      
      if (!order) {
        console.warn('⚠️ Order not found for webhook:', { cashfreeOrderId });
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update order based on webhook type and status
      let updateData = {
        lastWebhookAt: new Date(),
        webhookData: webhookData // Store the full webhook data for debugging
      };

      // Handle different webhook types
      switch (type) {
        case 'PAYMENT_SUCCESS_WEBHOOK':
        case 'PAYMENT_COMPLETED_WEBHOOK':
          if (orderStatus === 'PAID' || paymentStatus === 'SUCCESS') {
            console.log('✅ Payment successful for order:', order.orderId);
            
            updateData = {
              ...updateData,
              status: 'paid',
              transactionId: transactionId || order.transactionId,
              bankReference: bankReference || order.bankReference,
              paidAt: new Date(paymentTime || completionTime || Date.now()),
              paymentMethod: paymentMethodData?.payment_method || order.paymentMethod,
              upiTransactionId: paymentMethodData?.upi?.upi_transaction_id || order.upiTransactionId,
              authId: authId || order.authId
            };

            // Use the model method for consistency
            await order.markAsPaid({
              transactionId: updateData.transactionId,
              bankReference: updateData.bankReference,
              upiTransactionId: updateData.upiTransactionId,
              authId: updateData.authId,
              paymentMethod: updateData.paymentMethod
            });
          }
          break;

        case 'PAYMENT_FAILED_WEBHOOK':
        case 'PAYMENT_USER_DROPPED_WEBHOOK':
          if (orderStatus === 'FAILED' || paymentStatus === 'FAILED') {
            console.log('❌ Payment failed for order:', order.orderId);
            
            const errorMessage = paymentMessage || 'Payment failed';
            const errorCode = paymentInfo.payment_group || 'PAYMENT_FAILED';
            
            await order.markAsFailed(errorMessage, errorCode);
          }
          break;

        case 'PAYMENT_PENDING_WEBHOOK':
          console.log('⏳ Payment pending for order:', order.orderId);
          updateData.status = 'pending';
          Object.assign(order, updateData);
          await order.save();
          break;

        default:
          console.log('ℹ️ Unhandled webhook type:', type);
          Object.assign(order, updateData);
          await order.save();
      }

      console.log('✅ Order updated successfully:', {
        orderId: order.orderId,
        status: order.status,
        transactionId: order.transactionId
      });

      // Respond to Cashfree
      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });

    } catch (error) {
      console.error('❌ Webhook processing error:', {
        message: error.message,
        stack: error.stack
      });

      // Always respond with 200 to prevent Cashfree from retrying
      // Log the error for investigation
      res.status(200).json({
        success: false,
        message: 'Webhook processing failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
      });
    }
  }
);

/**
 * @route POST /api/webhooks/test
 * @desc Test webhook endpoint for development
 * @access Public (Development only)
 */
router.post('/test', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }

  try {
    const { orderId, status, transactionId } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'orderId and status are required'
      });
    }

    const order = await Order.findByOrderId(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Simulate webhook processing
    if (status === 'paid') {
      await order.markAsPaid({
        transactionId: transactionId || `test_txn_${Date.now()}`,
        bankReference: `test_bank_${Date.now()}`,
        upiTransactionId: `test_upi_${Date.now()}`
      });
    } else if (status === 'failed') {
      await order.markAsFailed('Test payment failure', 'TEST_FAILED');
    } else {
      order.status = status;
      await order.save();
    }

    console.log('🧪 Test webhook processed:', {
      orderId: order.orderId,
      status: order.status
    });

    res.status(200).json({
      success: true,
      message: 'Test webhook processed',
      data: {
        orderId: order.orderId,
        status: order.status,
        transactionId: order.transactionId
      }
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Test webhook failed',
      error: error.message
    });
  }
});

/**
 * @route GET /api/webhooks/health
 * @desc Health check for webhook endpoint
 * @access Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Webhook service is healthy',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route POST /api/webhooks/verify-signature
 * @desc Verify webhook signature (for testing)
 * @access Public (Development only)
 */
router.post('/verify-signature', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }

  try {
    const { payload, signature, timestamp } = req.body;

    if (!payload || !signature || !timestamp) {
      return res.status(400).json({
        success: false,
        message: 'payload, signature, and timestamp are required'
      });
    }

    const isValid = cashfreeService.verifyWebhookSignature(
      JSON.stringify(payload),
      signature,
      timestamp
    );

    res.status(200).json({
      success: true,
      isValid,
      message: isValid ? 'Signature is valid' : 'Signature is invalid'
    });

  } catch (error) {
    console.error('❌ Signature verification error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Signature verification failed',
      error: error.message
    });
  }
});

module.exports = router;