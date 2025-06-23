/**
 * Order functionality for Shubham Enterprise E-commerce Platform
 * Handles order creation, management, and related functionality
 */

const Orders = {
    /**
     * Get all orders from localStorage
     * @returns {Array} - Array of order objects
     */
    getAllOrders: function() {
        const ordersJson = localStorage.getItem('orders');
        return ordersJson ? JSON.parse(ordersJson) : [];
    },
    
    /**
     * Save orders to localStorage
     * @param {Array} orders - Array of order objects to save
     */
    saveOrders: function(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    },
    
    /**
     * Get order by ID
     * @param {string} orderId - Order ID to find
     * @returns {Object|null} - Order object or null if not found
     */
    getOrderById: function(orderId) {
        const orders = this.getAllOrders();
        return orders.find(order => order.id === orderId) || null;
    },
    
    /**
     * Get orders for a specific user
     * @param {string} userId - User ID to get orders for
     * @returns {Array} - Array of order objects for the user
     */
    getOrdersByUser: function(userId) {
        const orders = this.getAllOrders();
        return orders.filter(order => order.userId === userId);
    },
    
    /**
     * Create a new order
     * @param {Object} orderData - Order data including items, shipping, payment, etc.
     * @returns {Object} - Result object with success status, message, and order
     */
    createOrder: function(orderData) {
        if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
            return {
                success: false,
                message: 'Invalid order data'
            };
        }
        
        const orders = this.getAllOrders();
        
        // Generate order ID
        const orderId = 'ORD' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        // Calculate order totals
        const subtotal = orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const gst = subtotal * 0.18; // 18% GST
        const shippingCost = orderData.shippingMethod === 'express' ? 500 : 0; // Express shipping costs ₹500
        const total = subtotal + gst + shippingCost;
        
        // Create new order object
        const newOrder = {
            id: orderId,
            userId: orderData.userId,
            userName: orderData.userName || '',
            userEmail: orderData.userEmail || '',
            userPhone: orderData.userPhone || '',
            items: orderData.items,
            subtotal: subtotal,
            gst: gst,
            shippingCost: shippingCost,
            total: total,
            shippingAddress: orderData.shippingAddress || {},
            shippingMethod: orderData.shippingMethod || 'standard',
            paymentMethod: orderData.paymentMethod || 'advance',
            paymentStatus: orderData.paymentMethod === 'credit' ? 'partial' : 'pending',
            orderStatus: 'pending',
            notes: orderData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expectedDelivery: this.calculateExpectedDelivery(orderData.shippingMethod)
        };
        
        // Add order to orders array
        orders.push(newOrder);
        this.saveOrders(orders);
        
        // Update user's orders if Auth module is available
        if (window.ShubhamAuth) {
            const currentUser = window.ShubhamAuth.getCurrentUser();
            if (currentUser && currentUser.id === orderData.userId) {
                const users = window.ShubhamAuth.getUsers();
                const userIndex = users.findIndex(user => user.id === currentUser.id);
                
                if (userIndex !== -1) {
                    if (!users[userIndex].orders) {
                        users[userIndex].orders = [];
                    }
                    
                    users[userIndex].orders.push(orderId);
                    window.ShubhamAuth.saveUsers(users);
                }
            }
        }
        
        return {
            success: true,
            message: 'Order created successfully',
            order: newOrder
        };
    },
    
    /**
     * Update order status
     * @param {string} orderId - Order ID to update
     * @param {string} status - New order status
     * @returns {Object} - Result object with success status and message
     */
    updateOrderStatus: function(orderId, status) {
        const orders = this.getAllOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
            return {
                success: false,
                message: 'Order not found'
            };
        }
        
        // Update order status
        orders[orderIndex].orderStatus = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        this.saveOrders(orders);
        
        return {
            success: true,
            message: 'Order status updated successfully'
        };
    },
    
    /**
     * Update payment status
     * @param {string} orderId - Order ID to update
     * @param {string} status - New payment status
     * @returns {Object} - Result object with success status and message
     */
    updatePaymentStatus: function(orderId, status) {
        const orders = this.getAllOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
            return {
                success: false,
                message: 'Order not found'
            };
        }
        
        // Update payment status
        orders[orderIndex].paymentStatus = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        this.saveOrders(orders);
        
        return {
            success: true,
            message: 'Payment status updated successfully'
        };
    },
    
    /**
     * Add note to order
     * @param {string} orderId - Order ID to update
     * @param {string} note - Note to add
     * @returns {Object} - Result object with success status and message
     */
    addOrderNote: function(orderId, note) {
        if (!note) {
            return {
                success: false,
                message: 'Note cannot be empty'
            };
        }
        
        const orders = this.getAllOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
            return {
                success: false,
                message: 'Order not found'
            };
        }
        
        // Add note to order
        const timestamp = new Date().toISOString();
        const formattedNote = `[${new Date(timestamp).toLocaleString()}] ${note}`;
        
        if (!orders[orderIndex].notes) {
            orders[orderIndex].notes = formattedNote;
        } else {
            orders[orderIndex].notes += '\n' + formattedNote;
        }
        
        orders[orderIndex].updatedAt = timestamp;
        
        this.saveOrders(orders);
        
        return {
            success: true,
            message: 'Note added successfully'
        };
    },
    
    /**
     * Calculate expected delivery date based on shipping method
     * @param {string} shippingMethod - Shipping method (standard or express)
     * @returns {string} - Expected delivery date as ISO string
     */
    calculateExpectedDelivery: function(shippingMethod) {
        const today = new Date();
        let deliveryDate;
        
        if (shippingMethod === 'express') {
            // Express shipping: 2-3 business days
            deliveryDate = new Date(today);
            deliveryDate.setDate(today.getDate() + 3);
        } else {
            // Standard shipping: 5-7 business days
            deliveryDate = new Date(today);
            deliveryDate.setDate(today.getDate() + 7);
        }
        
        return deliveryDate.toISOString();
    },
    
    /**
     * Format currency (INR)
     * @param {number} amount - The amount to format
     * @returns {string} - Formatted currency string
     */
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount);
    },
    
    /**
     * Format date
     * @param {string} dateString - ISO date string
     * @returns {string} - Formatted date string
     */
    formatDate: function(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    },
    
    /**
     * Get order status badge HTML
     * @param {string} status - Order status
     * @returns {string} - HTML for status badge
     */
    getStatusBadgeHtml: function(status) {
        let badgeClass = '';
        
        switch (status.toLowerCase()) {
            case 'pending':
                badgeClass = 'bg-yellow-100 text-yellow-800';
                break;
            case 'processing':
                badgeClass = 'bg-blue-100 text-blue-800';
                break;
            case 'shipped':
                badgeClass = 'bg-purple-100 text-purple-800';
                break;
            case 'delivered':
                badgeClass = 'bg-green-100 text-green-800';
                break;
            case 'cancelled':
                badgeClass = 'bg-red-100 text-red-800';
                break;
            case 'completed':
                badgeClass = 'bg-green-100 text-green-800';
                break;
            case 'partial':
                badgeClass = 'bg-orange-100 text-orange-800';
                break;
            case 'paid':
                badgeClass = 'bg-green-100 text-green-800';
                break;
            default:
                badgeClass = 'bg-gray-100 text-gray-800';
        }
        
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${badgeClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
    },
    
    /**
     * Render order history for a user
     * @param {string} containerId - ID of container element
     * @param {string} userId - User ID to get orders for
     */
    renderOrderHistory: function(containerId, userId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const userOrders = this.getOrdersByUser(userId);
        
        if (userOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-bag text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-lg">You haven't placed any orders yet</p>
                    <a href="products.html" class="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition duration-300">Browse Products</a>
                </div>
            `;
            return;
        }
        
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Create order history HTML
        let ordersHtml = '';
        
        userOrders.forEach(order => {
            ordersHtml += `
                <div class="border rounded-lg overflow-hidden mb-6">
                    <div class="bg-gray-50 p-4 flex flex-wrap justify-between items-center border-b">
                        <div>
                            <p class="text-sm text-gray-500">Order ID</p>
                            <p class="font-medium">${order.id}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Date</p>
                            <p class="font-medium">${this.formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Total</p>
                            <p class="font-medium">${this.formatCurrency(order.total)}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Status</p>
                            <div class="mt-1">${this.getStatusBadgeHtml(order.orderStatus)}</div>
                        </div>
                        <div class="mt-2 sm:mt-0">
                            <button class="text-primary hover:text-primary/80 text-sm font-medium" 
                                    data-order-details="${order.id}">
                                View Details
                            </button>
                        </div>
                    </div>
                    <div class="p-4 order-details-content" id="order-details-${order.id}" style="display: none;">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-medium mb-2">Items</h4>
                                <div class="space-y-3">
                                    ${order.items.map(item => `
                                        <div class="flex items-start">
                                            <div class="w-12 h-12 flex-shrink-0">
                                                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded">
                                            </div>
                                            <div class="ml-3">
                                                <p class="font-medium">${item.name}</p>
                                                <p class="text-sm text-gray-500">${this.formatCurrency(item.price)} × ${item.quantity}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <div class="mb-4">
                                    <h4 class="font-medium mb-2">Shipping Address</h4>
                                    <p>${order.shippingAddress.name || ''}</p>
                                    <p>${order.shippingAddress.address || ''}</p>
                                    <p>${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.pincode || ''}</p>
                                    <p>${order.shippingAddress.phone || ''}</p>
                                </div>
                                <div class="mb-4">
                                    <h4 class="font-medium mb-2">Shipping Method</h4>
                                    <p>${order.shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'}</p>
                                    <p class="text-sm text-gray-500">Expected delivery by ${this.formatDate(order.expectedDelivery)}</p>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-2">Payment</h4>
                                    <p>${order.paymentMethod === 'credit' ? 'Credit (30% Advance)' : 'Full Advance Payment'}</p>
                                    <p class="text-sm text-gray-500">Status: ${this.getStatusBadgeHtml(order.paymentStatus)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t">
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-600">Subtotal</span>
                                <span>${this.formatCurrency(order.subtotal)}</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-600">GST (18%)</span>
                                <span>${this.formatCurrency(order.gst)}</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-600">Shipping</span>
                                <span>${this.formatCurrency(order.shippingCost)}</span>
                            </div>
                            <div class="flex justify-between font-bold mt-2 pt-2 border-t">
                                <span>Total</span>
                                <span>${this.formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = ordersHtml;
        
        // Add event listeners for order details toggle
        const detailButtons = container.querySelectorAll('[data-order-details]');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-details');
                const detailsContent = document.getElementById(`order-details-${orderId}`);
                
                if (detailsContent) {
                    const isVisible = detailsContent.style.display !== 'none';
                    detailsContent.style.display = isVisible ? 'none' : 'block';
                    button.textContent = isVisible ? 'View Details' : 'Hide Details';
                }
            });
        });
    },
    
    /**
     * Initialize orders functionality
     */
    init: function() {
        // Check if orders array exists in localStorage
        if (!localStorage.getItem('orders')) {
            // Initialize with empty array
            this.saveOrders([]);
        }
    }
};

// Initialize orders on page load
document.addEventListener('DOMContentLoaded', () => {
    Orders.init();
});

// Export Orders object for use in other scripts
window.ShubhamOrders = Orders;