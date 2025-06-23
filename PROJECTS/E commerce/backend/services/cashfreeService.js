const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class CashfreeService {
  constructor() {
    this.appId = process.env.CASHFREE_APP_ID;
    this.secretKey = process.env.CASHFREE_SECRET_KEY;
    this.baseUrl = process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/pg';
    
    if (!this.appId || !this.secretKey) {
      throw new Error('Cashfree credentials not found in environment variables');
    }
  }

  /**
   * Generate signature for Cashfree API authentication
   */
  generateSignature(postData) {
    const signatureData = Object.keys(postData)
      .sort()
      .map(key => `${key}=${postData[key]}`)
      .join('&');
    
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(signatureData)
      .digest('base64');
  }

  /**
   * Get headers for Cashfree API requests
   */
  getHeaders(signature = null) {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': this.appId,
    };

    if (signature) {
      headers['x-client-signature'] = signature;
    } else {
      headers['x-client-secret'] = this.secretKey;
    }

    return headers;
  }

  /**
   * Create a payment session with Cashfree
   */
  async createPaymentSession(orderData) {
    try {
      const {
        orderId,
        amount,
        customerName,
        email,
        phone,
        returnUrl,
        notifyUrl
      } = orderData;

      // Generate unique Cashfree order ID
      const cashfreeOrderId = `CF_${orderId}_${Date.now()}`;

      const paymentSessionData = {
        order_id: cashfreeOrderId,
        order_amount: parseFloat(amount).toFixed(2),
        order_currency: 'INR',
        customer_details: {
          customer_id: `CUST_${phone}`,
          customer_name: customerName,
          customer_email: email,
          customer_phone: phone
        },
        order_meta: {
          return_url: returnUrl || `${process.env.FRONTEND_URL}/payment-success`,
          notify_url: notifyUrl || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/webhooks/cashfree`,
          payment_methods: 'upi'
        },
        order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        order_note: `Payment for order ${orderId} - Shubham Enterprise`
      };

      console.log('🔄 Creating Cashfree payment session:', {
        cashfreeOrderId,
        amount: paymentSessionData.order_amount,
        customer: customerName
      });

      const response = await axios.post(
        `${this.baseUrl}/orders`,
        paymentSessionData,
        {
          headers: this.getHeaders(),
          timeout: 30000
        }
      );

      if (response.data && response.data.payment_session_id) {
        console.log('✅ Cashfree payment session created successfully:', {
          cashfreeOrderId,
          paymentSessionId: response.data.payment_session_id
        });

        return {
          success: true,
          cashfreeOrderId,
          paymentSessionId: response.data.payment_session_id,
          paymentUrl: response.data.payment_links?.web || null,
          orderToken: response.data.order_token || null,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Cashfree API');
      }
    } catch (error) {
      console.error('❌ Error creating Cashfree payment session:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Get payment status from Cashfree
   */
  async getPaymentStatus(cashfreeOrderId) {
    try {
      console.log('🔄 Checking payment status for order:', cashfreeOrderId);

      const response = await axios.get(
        `${this.baseUrl}/orders/${cashfreeOrderId}`,
        {
          headers: this.getHeaders(),
          timeout: 15000
        }
      );

      if (response.data) {
        console.log('✅ Payment status retrieved:', {
          orderId: cashfreeOrderId,
          status: response.data.order_status,
          amount: response.data.order_amount
        });

        return {
          success: true,
          status: response.data.order_status,
          amount: response.data.order_amount,
          currency: response.data.order_currency,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Cashfree API');
      }
    } catch (error) {
      console.error('❌ Error getting payment status:', {
        orderId: cashfreeOrderId,
        message: error.message,
        response: error.response?.data
      });

      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Get payment details including transaction info
   */
  async getPaymentDetails(cashfreeOrderId) {
    try {
      console.log('🔄 Getting payment details for order:', cashfreeOrderId);

      const response = await axios.get(
        `${this.baseUrl}/orders/${cashfreeOrderId}/payments`,
        {
          headers: this.getHeaders(),
          timeout: 15000
        }
      );

      if (response.data && response.data.length > 0) {
        const paymentData = response.data[0]; // Get the latest payment
        
        console.log('✅ Payment details retrieved:', {
          orderId: cashfreeOrderId,
          paymentStatus: paymentData.payment_status,
          paymentMethod: paymentData.payment_method
        });

        return {
          success: true,
          paymentStatus: paymentData.payment_status,
          paymentMethod: paymentData.payment_method,
          transactionId: paymentData.cf_payment_id,
          bankReference: paymentData.bank_reference,
          upiTransactionId: paymentData.upi?.upi_transaction_id,
          data: paymentData
        };
      } else {
        return {
          success: true,
          paymentStatus: 'NOT_ATTEMPTED',
          data: null
        };
      }
    } catch (error) {
      console.error('❌ Error getting payment details:', {
        orderId: cashfreeOrderId,
        message: error.message,
        response: error.response?.data
      });

      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(rawBody, signature, timestamp) {
    try {
      const signatureData = `${timestamp}.${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(signatureData)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('❌ Error verifying webhook signature:', error.message);
      return false;
    }
  }

  /**
   * Generate UPI intent link for fallback
   */
  generateUpiLink(amount, orderId, merchantName = 'Shubham Enterprise') {
    const upiId = process.env.UPI_ID || 'yourupiid@okaxis';
    const transactionNote = `Order Payment #${orderId}`;
    
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  }

  /**
   * Generate QR code data for UPI
   */
  generateQrCodeData(amount, orderId, merchantName = 'Shubham Enterprise') {
    return this.generateUpiLink(amount, orderId, merchantName);
  }
}

module.exports = new CashfreeService();