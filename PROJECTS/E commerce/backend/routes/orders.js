const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { validate, schemas } = require('../middleware/validation');

/**
 * @route GET /api/orders
 * @desc Get all orders with pagination and filtering
 * @access Public (should be protected in production)
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      email,
      phone,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }
    
    if (phone) {
      filter.phone = { $regex: phone };
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute queries
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

/**
 * @route GET /api/orders/:orderId
 * @desc Get a specific order by ID
 * @access Public
 */
router.get('/:orderId', 
  validate(schemas.getOrderStatus, 'params'),
  async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await Order.findByOrderId(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          orderId
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });

    } catch (error) {
      console.error('❌ Error fetching order:', {
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

/**
 * @route PUT /api/orders/:orderId/status
 * @desc Update order status
 * @access Public (should be protected in production)
 */
router.put('/:orderId/status',
  validate(schemas.getOrderStatus, 'params'),
  validate(schemas.updateOrderStatus),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const {
        status,
        transactionId,
        bankReference,
        upiTransactionId,
        errorMessage,
        errorCode
      } = req.body;

      const order = await Order.findByOrderId(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          orderId
        });
      }

      // Update order based on status
      if (status === 'paid') {
        await order.markAsPaid({
          transactionId,
          bankReference,
          upiTransactionId
        });
      } else if (status === 'failed') {
        await order.markAsFailed(errorMessage, errorCode);
      } else {
        order.status = status;
        if (transactionId) order.transactionId = transactionId;
        if (bankReference) order.bankReference = bankReference;
        if (upiTransactionId) order.upiTransactionId = upiTransactionId;
        if (errorMessage) order.errorMessage = errorMessage;
        if (errorCode) order.errorCode = errorCode;
        
        await order.save();
      }

      console.log('✅ Order status updated:', {
        orderId: order.orderId,
        status: order.status,
        transactionId: order.transactionId
      });

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          orderId: order.orderId,
          status: order.status,
          transactionId: order.transactionId,
          updatedAt: order.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Error updating order status:', {
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

/**
 * @route GET /api/orders/customer/:email
 * @desc Get orders for a specific customer
 * @access Public
 */
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, totalCount] = await Promise.all([
      Order.find({ email: email.toLowerCase() })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments({ email: email.toLowerCase() })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching customer orders:', {
      email: req.params.email,
      message: error.message
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

/**
 * @route GET /api/orders/stats/summary
 * @desc Get order statistics summary
 * @access Public (should be protected in production)
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregate statistics
    const stats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          paidAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] }
          },
          failedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $in: ['$status', ['initiated', 'pending']] }, 1, 0] }
          }
        }
      }
    ]);

    const summary = stats[0] || {
      totalOrders: 0,
      totalAmount: 0,
      paidOrders: 0,
      paidAmount: 0,
      failedOrders: 0,
      pendingOrders: 0
    };

    // Calculate success rate
    summary.successRate = summary.totalOrders > 0 
      ? ((summary.paidOrders / summary.totalOrders) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('❌ Error fetching order stats:', {
      message: error.message
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;