/**
 * Admin functionality for Shubham Enterprise E-commerce Platform
 * Handles admin dashboard, product management, order management, etc.
 */

const Admin = {
    /**
     * Check if current user is admin
     * @returns {boolean} - True if user is admin, false otherwise
     */
    isAdmin: function() {
        if (window.ShubhamAuth) {
            return window.ShubhamAuth.isAdmin();
        }
        return false;
    },
    
    /**
     * Redirect to admin login if not logged in as admin
     */
    requireAdmin: function() {
        if (!this.isAdmin()) {
            window.location.href = 'admin-login.html';
        }
    },
    
    /**
     * Get dashboard statistics
     * @returns {Object} - Object with dashboard statistics
     */
    getDashboardStats: function() {
        const orders = window.ShubhamOrders ? window.ShubhamOrders.getAllOrders() : [];
        const products = window.ShubhamProducts || [];
        const users = window.ShubhamAuth ? window.ShubhamAuth.getUsers() : [];
        
        // Calculate total revenue
        const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
        
        // Calculate pending orders count
        const pendingOrders = orders.filter(order => 
            order.orderStatus === 'pending' || order.orderStatus === 'processing'
        ).length;
        
        // Calculate low stock products count
        const lowStockThreshold = 100; // Define threshold for low stock
        const lowStockProducts = products.filter(product => product.stock < lowStockThreshold).length;
        
        // Calculate new customers (registered in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newCustomers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= thirtyDaysAgo;
        }).length;
        
        return {
            totalRevenue,
            pendingOrders,
            lowStockProducts,
            newCustomers,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalCustomers: users.length
        };
    },
    
    /**
     * Render dashboard statistics
     * @param {string} containerId - ID of container element
     */
    renderDashboardStats: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = this.getDashboardStats();
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                            <i class="fas fa-rupee-sign text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-gray-500 text-sm">Total Revenue</p>
                            <h3 class="font-bold text-2xl">${this.formatCurrency(stats.totalRevenue)}</h3>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                            <i class="fas fa-shopping-bag text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-gray-500 text-sm">Pending Orders</p>
                            <h3 class="font-bold text-2xl">${stats.pendingOrders}</h3>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-red-100 text-red-600">
                            <i class="fas fa-exclamation-triangle text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-gray-500 text-sm">Low Stock Products</p>
                            <h3 class="font-bold text-2xl">${stats.lowStockProducts}</h3>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-green-100 text-green-600">
                            <i class="fas fa-user-plus text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-gray-500 text-sm">New Customers</p>
                            <h3 class="font-bold text-2xl">${stats.newCustomers}</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-medium">Total Orders</h3>
                        <span class="text-2xl font-bold">${stats.totalOrders}</span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="bg-blue-500 h-full" style="width: 100%"></div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-medium">Total Products</h3>
                        <span class="text-2xl font-bold">${stats.totalProducts}</span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="bg-green-500 h-full" style="width: 100%"></div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-medium">Total Customers</h3>
                        <span class="text-2xl font-bold">${stats.totalCustomers}</span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="bg-purple-500 h-full" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Get recent orders for dashboard
     * @param {number} [limit=5] - Maximum number of orders to return
     * @returns {Array} - Array of recent order objects
     */
    getRecentOrders: function(limit = 5) {
        const orders = window.ShubhamOrders ? window.ShubhamOrders.getAllOrders() : [];
        
        // Sort orders by date (newest first)
        const sortedOrders = [...orders].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Return limited number of orders
        return sortedOrders.slice(0, limit);
    },
    
    /**
     * Render recent orders for dashboard
     * @param {string} containerId - ID of container element
     * @param {number} [limit=5] - Maximum number of orders to display
     */
    renderRecentOrders: function(containerId, limit = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const recentOrders = this.getRecentOrders(limit);
        
        if (recentOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-6">
                    <p class="text-gray-500">No orders found</p>
                </div>
            `;
            return;
        }
        
        let ordersHtml = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;
        
        recentOrders.forEach(order => {
            ordersHtml += `
                <tr>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${order.id}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${order.userName}</div>
                        <div class="text-sm text-gray-500">${order.userEmail}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${this.formatDate(order.createdAt)}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${this.formatCurrency(order.total)}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        ${this.getStatusBadgeHtml(order.orderStatus)}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                        <a href="admin-orders.html?id=${order.id}" class="text-primary hover:text-primary/80">View</a>
                    </td>
                </tr>
            `;
        });
        
        ordersHtml += `
                    </tbody>
                </table>
            </div>
            <div class="mt-4 text-right">
                <a href="admin-orders.html" class="text-primary hover:text-primary/80 text-sm font-medium">View All Orders</a>
            </div>
        `;
        
        container.innerHTML = ordersHtml;
    },
    
    /**
     * Get low stock products for dashboard
     * @param {number} [limit=5] - Maximum number of products to return
     * @returns {Array} - Array of low stock product objects
     */
    getLowStockProducts: function(limit = 5) {
        const products = window.ShubhamProducts || [];
        
        // Define threshold for low stock
        const lowStockThreshold = 100;
        
        // Filter products with stock below threshold
        const lowStockProducts = products.filter(product => product.stock < lowStockThreshold);
        
        // Sort by stock level (ascending)
        const sortedProducts = [...lowStockProducts].sort((a, b) => a.stock - b.stock);
        
        // Return limited number of products
        return sortedProducts.slice(0, limit);
    },
    
    /**
     * Render low stock products for dashboard
     * @param {string} containerId - ID of container element
     * @param {number} [limit=5] - Maximum number of products to display
     */
    renderLowStockProducts: function(containerId, limit = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const lowStockProducts = this.getLowStockProducts(limit);
        
        if (lowStockProducts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-6">
                    <p class="text-gray-500">No low stock products found</p>
                </div>
            `;
            return;
        }
        
        let productsHtml = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;
        
        lowStockProducts.forEach(product => {
            productsHtml += `
                <tr>
                    <td class="px-4 py-3">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded object-cover" src="${product.image}" alt="${product.name}">
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${product.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${product.sku}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${product.category}</div>
                        <div class="text-sm text-gray-500">${product.subcategory}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            ${product.stock} ${product.unit || 'units'}
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                        <a href="admin-products.html?id=${product.id}" class="text-primary hover:text-primary/80">Edit</a>
                    </td>
                </tr>
            `;
        });
        
        productsHtml += `
                    </tbody>
                </table>
            </div>
            <div class="mt-4 text-right">
                <a href="admin-products.html" class="text-primary hover:text-primary/80 text-sm font-medium">View All Products</a>
            </div>
        `;
        
        container.innerHTML = productsHtml;
    },
    
    /**
     * Get recent customers for dashboard
     * @param {number} [limit=5] - Maximum number of customers to return
     * @returns {Array} - Array of recent customer objects
     */
    getRecentCustomers: function(limit = 5) {
        const users = window.ShubhamAuth ? window.ShubhamAuth.getUsers() : [];
        
        // Filter out admin users
        const customers = users.filter(user => user.role !== 'admin');
        
        // Sort customers by registration date (newest first)
        const sortedCustomers = [...customers].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Return limited number of customers
        return sortedCustomers.slice(0, limit);
    },
    
    /**
     * Render recent customers for dashboard
     * @param {string} containerId - ID of container element
     * @param {number} [limit=5] - Maximum number of customers to display
     */
    renderRecentCustomers: function(containerId, limit = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const recentCustomers = this.getRecentCustomers(limit);
        
        if (recentCustomers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-6">
                    <p class="text-gray-500">No customers found</p>
                </div>
            `;
            return;
        }
        
        let customersHtml = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;
        
        recentCustomers.forEach(customer => {
            let creditBadge = '';
            
            switch (customer.creditStatus) {
                case 'approved':
                    creditBadge = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>';
                    break;
                case 'pending':
                    creditBadge = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>';
                    break;
                case 'rejected':
                    creditBadge = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>';
                    break;
                default:
                    creditBadge = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Not Applied</span>';
            }
            
            customersHtml += `
                <tr>
                    <td class="px-4 py-3">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span class="text-gray-600 font-medium">${customer.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${customer.name}</div>
                                <div class="text-sm text-gray-500">${customer.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${customer.company || 'N/A'}</div>
                        <div class="text-sm text-gray-500">${customer.gst || 'No GST'}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${this.formatDate(customer.createdAt)}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        ${creditBadge}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                        <a href="admin-customers.html?id=${customer.id}" class="text-primary hover:text-primary/80">View</a>
                    </td>
                </tr>
            `;
        });
        
        customersHtml += `
                    </tbody>
                </table>
            </div>
            <div class="mt-4 text-right">
                <a href="admin-customers.html" class="text-primary hover:text-primary/80 text-sm font-medium">View All Customers</a>
            </div>
        `;
        
        container.innerHTML = customersHtml;
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
     * Get status badge HTML
     * @param {string} status - Status string
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
            case 'approved':
                badgeClass = 'bg-green-100 text-green-800';
                break;
            case 'rejected':
                badgeClass = 'bg-red-100 text-red-800';
                break;
            default:
                badgeClass = 'bg-gray-100 text-gray-800';
        }
        
        return `<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
    },
    
    /**
     * Initialize admin dashboard
     */
    initDashboard: function() {
        // Check if user is admin
        this.requireAdmin();
        
        // Render dashboard components
        this.renderDashboardStats('dashboard-stats');
        this.renderRecentOrders('recent-orders');
        this.renderLowStockProducts('low-stock-products');
        this.renderRecentCustomers('recent-customers');
    },
    
    /**
     * Initialize admin functionality
     */
    init: function() {
        // Add event listener for sidebar toggle on mobile
        document.addEventListener('DOMContentLoaded', () => {
            const sidebarToggle = document.getElementById('sidebar-toggle');
            const sidebar = document.getElementById('sidebar');
            
            if (sidebarToggle && sidebar) {
                sidebarToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('hidden');
                    sidebar.classList.toggle('block');
                });
            }
            
            // Add event listener for profile dropdown
            const profileDropdownButton = document.getElementById('profile-dropdown-button');
            const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
            
            if (profileDropdownButton && profileDropdownMenu) {
                profileDropdownButton.addEventListener('click', () => {
                    profileDropdownMenu.classList.toggle('hidden');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', (event) => {
                    if (!profileDropdownButton.contains(event.target) && !profileDropdownMenu.contains(event.target)) {
                        profileDropdownMenu.classList.add('hidden');
                    }
                });
            }
            
            // Add event listener for logout button
            const logoutButton = document.querySelector('[data-admin-logout]');
            if (logoutButton && window.ShubhamAuth) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.ShubhamAuth.logout();
                    window.location.href = 'admin-login.html';
                });
            }
        });
    }
};

// Initialize admin functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});

// Export Admin object for use in other scripts
window.ShubhamAdmin = Admin;