/**
 * Cart functionality for Shubham Enterprise E-commerce Platform
 * Handles cart operations like adding, updating, removing items and calculating totals
 */

// Cart object with methods for cart management
const Cart = {
    /**
     * Get cart items from localStorage
     * @returns {Array} - Array of cart items
     */
    getItems: function() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },
    
    /**
     * Save cart items to localStorage
     * @param {Array} items - Array of cart items to save
     */
    saveItems: function(items) {
        localStorage.setItem('cart', JSON.stringify(items));
        this.updateCartCount();
    },
    
    /**
     * Add item to cart
     * @param {Object} product - Product to add to cart
     * @param {number} quantity - Quantity to add
     * @param {number} [tierIndex] - Index of the price tier (for MOQ pricing)
     * @returns {boolean} - Success status
     */
    addItem: function(product, quantity, tierIndex = 0) {
        if (!product || !product.id || quantity <= 0) {
            console.error('Invalid product or quantity');
            return false;
        }
        
        const items = this.getItems();
        
        // Check if product already exists in cart
        const existingItemIndex = items.findIndex(item => 
            item.id === product.id && item.tierIndex === tierIndex
        );
        
        if (existingItemIndex !== -1) {
            // Update quantity if product exists
            items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if product doesn't exist
            items.push({
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.priceTiers ? product.priceTiers[tierIndex].price : product.price,
                quantity: quantity,
                tierIndex: tierIndex,
                moq: product.priceTiers ? product.priceTiers[tierIndex].moq : product.moq || 1,
                category: product.category || '',
                sku: product.sku || ''
            });
        }
        
        this.saveItems(items);
        return true;
    },
    
    /**
     * Update item quantity in cart
     * @param {string} itemId - ID of the item to update
     * @param {number} quantity - New quantity
     * @param {number} [tierIndex] - Index of the price tier
     * @returns {boolean} - Success status
     */
    updateItemQuantity: function(itemId, quantity, tierIndex = null) {
        if (!itemId || quantity <= 0) {
            console.error('Invalid item ID or quantity');
            return false;
        }
        
        const items = this.getItems();
        
        // Find the item to update
        const itemIndex = items.findIndex(item => {
            if (tierIndex !== null) {
                return item.id === itemId && item.tierIndex === tierIndex;
            }
            return item.id === itemId;
        });
        
        if (itemIndex === -1) {
            console.error('Item not found in cart');
            return false;
        }
        
        // Update quantity
        items[itemIndex].quantity = quantity;
        
        this.saveItems(items);
        return true;
    },
    
    /**
     * Remove item from cart
     * @param {string} itemId - ID of the item to remove
     * @param {number} [tierIndex] - Index of the price tier
     * @returns {boolean} - Success status
     */
    removeItem: function(itemId, tierIndex = null) {
        if (!itemId) {
            console.error('Invalid item ID');
            return false;
        }
        
        let items = this.getItems();
        
        // Filter out the item to remove
        items = items.filter(item => {
            if (tierIndex !== null) {
                return !(item.id === itemId && item.tierIndex === tierIndex);
            }
            return item.id !== itemId;
        });
        
        this.saveItems(items);
        return true;
    },
    
    /**
     * Clear all items from cart
     */
    clearCart: function() {
        localStorage.removeItem('cart');
        this.updateCartCount();
    },
    
    /**
     * Get cart count
     * @returns {number} - Number of items in cart
     */
    getCount: function() {
        const items = this.getItems();
        return items.length;
    },
    
    /**
     * Update cart count in UI
     */
    updateCartCount: function() {
        const count = this.getCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    },
    
    /**
     * Calculate subtotal for a specific item
     * @param {Object} item - Cart item
     * @returns {number} - Subtotal for the item
     */
    calculateItemSubtotal: function(item) {
        return item.price * item.quantity;
    },
    
    /**
     * Calculate cart subtotal (before tax)
     * @returns {number} - Cart subtotal
     */
    calculateSubtotal: function() {
        const items = this.getItems();
        return items.reduce((total, item) => total + this.calculateItemSubtotal(item), 0);
    },
    
    /**
     * Calculate GST amount (18%)
     * @returns {number} - GST amount
     */
    calculateGST: function() {
        const subtotal = this.calculateSubtotal();
        return subtotal * 0.18; // 18% GST
    },
    
    /**
     * Calculate cart total (including tax)
     * @returns {number} - Cart total
     */
    calculateTotal: function() {
        const subtotal = this.calculateSubtotal();
        const gst = this.calculateGST();
        return subtotal + gst;
    },
    
    /**
     * Check if all items meet their MOQ requirements
     * @returns {boolean} - True if all items meet MOQ, false otherwise
     */
    checkMOQRequirements: function() {
        const items = this.getItems();
        return items.every(item => item.quantity >= item.moq);
    },
    
    /**
     * Get items that don't meet MOQ requirements
     * @returns {Array} - Array of items that don't meet MOQ
     */
    getItemsBelowMOQ: function() {
        const items = this.getItems();
        return items.filter(item => item.quantity < item.moq);
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
     * Render cart items in a container
     * @param {string} containerId - ID of the container element
     * @param {Function} [itemRenderer] - Custom function to render each item
     */
    renderCartItems: function(containerId, itemRenderer) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const items = this.getItems();
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-lg">Your cart is empty</p>
                    <a href="products.html" class="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition duration-300">Browse Products</a>
                </div>
            `;
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Render each item
        items.forEach(item => {
            if (typeof itemRenderer === 'function') {
                // Use custom renderer if provided
                const itemElement = itemRenderer(item);
                container.appendChild(itemElement);
            } else {
                // Use default renderer
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item flex items-center border-b border-gray-200 py-4';
                itemElement.innerHTML = `
                    <div class="w-20 h-20 flex-shrink-0">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded">
                    </div>
                    <div class="ml-4 flex-grow">
                        <h3 class="text-lg font-medium">${item.name}</h3>
                        <p class="text-gray-500 text-sm">${item.sku ? `SKU: ${item.sku}` : ''}</p>
                        <p class="text-primary font-medium">${this.formatCurrency(item.price)} × ${item.quantity}</p>
                    </div>
                    <div class="flex-shrink-0 text-right">
                        <p class="text-lg font-semibold">${this.formatCurrency(this.calculateItemSubtotal(item))}</p>
                        <button class="text-red-500 hover:text-red-700 mt-2" data-remove-item="${item.id}" data-tier-index="${item.tierIndex}">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                    </div>
                `;
                container.appendChild(itemElement);
            }
        });
        
        // Add event listeners for remove buttons
        const removeButtons = container.querySelectorAll('[data-remove-item]');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-remove-item');
                const tierIndex = parseInt(button.getAttribute('data-tier-index') || '0');
                this.removeItem(itemId, tierIndex);
                this.renderCartItems(containerId, itemRenderer);
                this.renderCartSummary();
            });
        });
    },
    
    /**
     * Render cart summary (subtotal, tax, total)
     * @param {string} [summaryContainerId='cart-summary'] - ID of the summary container
     */
    renderCartSummary: function(summaryContainerId = 'cart-summary') {
        const container = document.getElementById(summaryContainerId);
        if (!container) return;
        
        const subtotal = this.calculateSubtotal();
        const gst = this.calculateGST();
        const total = this.calculateTotal();
        
        container.innerHTML = `
            <div class="border-t border-b border-gray-200 py-4">
                <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-medium">${this.formatCurrency(subtotal)}</span>
                </div>
                <div class="flex justify-between mb-2">
                    <span class="text-gray-600">GST (18%)</span>
                    <span class="font-medium">${this.formatCurrency(gst)}</span>
                </div>
                <div class="flex justify-between text-lg font-bold mt-4">
                    <span>Total</span>
                    <span>${this.formatCurrency(total)}</span>
                </div>
            </div>
        `;
    },
    
    /**
     * Initialize cart functionality
     */
    init: function() {
        // Update cart count on page load
        this.updateCartCount();
        
        // Add event listener for add to cart buttons
        const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-add-to-cart');
                const quantityInput = document.querySelector(`[data-quantity="${productId}"]`);
                const tierSelect = document.querySelector(`[data-tier="${productId}"]`);
                
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                const tierIndex = tierSelect ? parseInt(tierSelect.value) : 0;
                
                // Get product data from data attributes or fetch from API
                const product = {
                    id: productId,
                    name: button.getAttribute('data-name'),
                    image: button.getAttribute('data-image'),
                    price: parseFloat(button.getAttribute('data-price')),
                    sku: button.getAttribute('data-sku'),
                    category: button.getAttribute('data-category'),
                    priceTiers: JSON.parse(button.getAttribute('data-price-tiers') || 'null')
                };
                
                if (this.addItem(product, quantity, tierIndex)) {
                    // Show success message
                    if (window.shubhamEnterprise && window.shubhamEnterprise.showToast) {
                        window.shubhamEnterprise.showToast('Product added to cart successfully', 'success');
                    } else {
                        alert('Product added to cart successfully');
                    }
                }
            });
        });
    }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});

// Export Cart object for use in other scripts
window.ShubhamCart = Cart;