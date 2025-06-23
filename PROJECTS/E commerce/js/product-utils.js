/**
 * Product utilities for Shubham Enterprise E-commerce Platform
 * Handles product display, filtering, sorting, and related functionality
 */

const ProductUtils = {
    /**
     * Get all products
     * @returns {Array} - Array of product objects
     */
    getAllProducts: function() {
        // Use the products from products.js if available
        if (window.ShubhamProducts) {
            return window.ShubhamProducts;
        }
        
        // Fallback to empty array if products not available
        return [];
    },
    
    /**
     * Get product by ID
     * @param {string} productId - Product ID to find
     * @returns {Object|null} - Product object or null if not found
     */
    getProductById: function(productId) {
        const products = this.getAllProducts();
        return products.find(product => product.id === productId) || null;
    },
    
    /**
     * Get products by category
     * @param {string} category - Category to filter by
     * @returns {Array} - Array of filtered product objects
     */
    getProductsByCategory: function(category) {
        const products = this.getAllProducts();
        return products.filter(product => product.category === category);
    },
    
    /**
     * Get products by subcategory
     * @param {string} subcategory - Subcategory to filter by
     * @returns {Array} - Array of filtered product objects
     */
    getProductsBySubcategory: function(subcategory) {
        const products = this.getAllProducts();
        return products.filter(product => product.subcategory === subcategory);
    },
    
    /**
     * Get featured products
     * @param {number} [limit] - Maximum number of products to return
     * @returns {Array} - Array of featured product objects
     */
    getFeaturedProducts: function(limit) {
        const products = this.getAllProducts();
        const featuredProducts = products.filter(product => product.featured);
        
        if (limit && featuredProducts.length > limit) {
            return featuredProducts.slice(0, limit);
        }
        
        return featuredProducts;
    },
    
    /**
     * Get best selling products
     * @param {number} [limit] - Maximum number of products to return
     * @returns {Array} - Array of best selling product objects
     */
    getBestSellingProducts: function(limit) {
        const products = this.getAllProducts();
        const bestSellers = products.filter(product => product.bestSeller);
        
        if (limit && bestSellers.length > limit) {
            return bestSellers.slice(0, limit);
        }
        
        return bestSellers;
    },
    
    /**
     * Get new products
     * @param {number} [limit] - Maximum number of products to return
     * @returns {Array} - Array of new product objects
     */
    getNewProducts: function(limit) {
        const products = this.getAllProducts();
        const newProducts = products.filter(product => product.new);
        
        if (limit && newProducts.length > limit) {
            return newProducts.slice(0, limit);
        }
        
        return newProducts;
    },
    
    /**
     * Search products by query
     * @param {string} query - Search query
     * @returns {Array} - Array of matching product objects
     */
    searchProducts: function(query) {
        if (!query) return this.getAllProducts();
        
        const products = this.getAllProducts();
        const searchTerm = query.toLowerCase().trim();
        
        return products.filter(product => {
            // Search in various product fields
            return (
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.subcategory.toLowerCase().includes(searchTerm) ||
                (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        });
    },
    
    /**
     * Filter products by price range
     * @param {Array} products - Array of products to filter
     * @param {number} minPrice - Minimum price
     * @param {number} maxPrice - Maximum price
     * @returns {Array} - Array of filtered product objects
     */
    filterByPriceRange: function(products, minPrice, maxPrice) {
        return products.filter(product => {
            const price = product.basePrice || 
                         (product.priceTiers && product.priceTiers.length > 0 ? 
                          product.priceTiers[0].price : 0);
            
            return price >= minPrice && price <= maxPrice;
        });
    },
    
    /**
     * Sort products by specified criteria
     * @param {Array} products - Array of products to sort
     * @param {string} sortBy - Sort criteria (name, price-asc, price-desc, rating)
     * @returns {Array} - Array of sorted product objects
     */
    sortProducts: function(products, sortBy) {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
                
            case 'price-asc':
                sortedProducts.sort((a, b) => {
                    const priceA = a.basePrice || (a.priceTiers && a.priceTiers.length > 0 ? a.priceTiers[0].price : 0);
                    const priceB = b.basePrice || (b.priceTiers && b.priceTiers.length > 0 ? b.priceTiers[0].price : 0);
                    return priceA - priceB;
                });
                break;
                
            case 'price-desc':
                sortedProducts.sort((a, b) => {
                    const priceA = a.basePrice || (a.priceTiers && a.priceTiers.length > 0 ? a.priceTiers[0].price : 0);
                    const priceB = b.basePrice || (b.priceTiers && b.priceTiers.length > 0 ? b.priceTiers[0].price : 0);
                    return priceB - priceA;
                });
                break;
                
            case 'rating':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
                
            default:
                // Default sort by name
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return sortedProducts;
    },
    
    /**
     * Get unique categories from all products
     * @returns {Array} - Array of unique category strings
     */
    getUniqueCategories: function() {
        const products = this.getAllProducts();
        const categories = products.map(product => product.category);
        return [...new Set(categories)].sort();
    },
    
    /**
     * Get unique subcategories from all products
     * @param {string} [category] - Optional category to filter subcategories
     * @returns {Array} - Array of unique subcategory strings
     */
    getUniqueSubcategories: function(category) {
        const products = this.getAllProducts();
        let filteredProducts = products;
        
        if (category) {
            filteredProducts = products.filter(product => product.category === category);
        }
        
        const subcategories = filteredProducts.map(product => product.subcategory);
        return [...new Set(subcategories)].sort();
    },
    
    /**
     * Get price range (min and max) from all products
     * @returns {Object} - Object with min and max price
     */
    getPriceRange: function() {
        const products = this.getAllProducts();
        
        if (products.length === 0) {
            return { min: 0, max: 0 };
        }
        
        const prices = products.map(product => {
            return product.basePrice || 
                  (product.priceTiers && product.priceTiers.length > 0 ? 
                   product.priceTiers[0].price : 0);
        });
        
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    },
    
    /**
     * Get related products based on category and tags
     * @param {string} productId - Current product ID
     * @param {number} [limit=4] - Maximum number of related products to return
     * @returns {Array} - Array of related product objects
     */
    getRelatedProducts: function(productId, limit = 4) {
        const currentProduct = this.getProductById(productId);
        if (!currentProduct) return [];
        
        const allProducts = this.getAllProducts();
        
        // Filter out the current product
        const otherProducts = allProducts.filter(product => product.id !== productId);
        
        // Score products based on relevance (same category, subcategory, shared tags)
        const scoredProducts = otherProducts.map(product => {
            let score = 0;
            
            // Same category
            if (product.category === currentProduct.category) {
                score += 3;
            }
            
            // Same subcategory
            if (product.subcategory === currentProduct.subcategory) {
                score += 2;
            }
            
            // Shared tags
            if (currentProduct.tags && product.tags) {
                const sharedTags = currentProduct.tags.filter(tag => 
                    product.tags.includes(tag)
                );
                score += sharedTags.length;
            }
            
            return { product, score };
        });
        
        // Sort by score (descending) and take the top 'limit' products
        const relatedProducts = scoredProducts
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.product);
        
        return relatedProducts;
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
     * Render product card HTML
     * @param {Object} product - Product object
     * @returns {string} - HTML string for product card
     */
    renderProductCard: function(product) {
        if (!product) return '';
        
        const price = product.basePrice || 
                     (product.priceTiers && product.priceTiers.length > 0 ? 
                      product.priceTiers[0].price : 0);
        
        const moqText = product.priceTiers && product.priceTiers.length > 0 ?
            `MOQ: ${product.priceTiers[0].moq} ${product.unit || 'units'}` : '';
        
        const badgeHtml = product.new ? 
            '<span class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>' : 
            (product.bestSeller ? 
             '<span class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">Best Seller</span>' : '');
        
        return `
            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
                <div class="relative">
                    ${badgeHtml}
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    </a>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-medium mb-1 truncate">
                        <a href="product-detail.html?id=${product.id}" class="text-gray-800 hover:text-primary">${product.name}</a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-2">${product.description}</p>
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400">
                            ${this.renderStarRating(product.rating)}
                        </div>
                        <span class="text-gray-500 text-xs ml-1">(${product.reviewCount})</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-primary font-bold">${this.formatCurrency(price)}</p>
                            <p class="text-gray-500 text-xs">${moqText}</p>
                        </div>
                        <button class="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition duration-300"
                                data-add-to-cart="${product.id}"
                                data-name="${product.name}"
                                data-image="${product.image}"
                                data-price="${price}"
                                data-sku="${product.sku || ''}"
                                data-category="${product.category || ''}"
                                data-price-tiers="${JSON.stringify(product.priceTiers || []).replace(/"/g, '&quot;')}">
                            <i class="fas fa-shopping-cart mr-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render star rating HTML
     * @param {number} rating - Rating value (0-5)
     * @returns {string} - HTML string for star rating
     */
    renderStarRating: function(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    },
    
    /**
     * Render product grid HTML
     * @param {Array} products - Array of product objects
     * @param {string} containerId - ID of container element
     * @param {number} [columns=3] - Number of columns in grid
     */
    renderProductGrid: function(products, containerId, columns = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-box-open text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-lg">No products found</p>
                </div>
            `;
            return;
        }
        
        // Set grid columns based on parameter
        container.className = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`;
        
        // Clear container
        container.innerHTML = '';
        
        // Render each product card
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.innerHTML = this.renderProductCard(product);
            container.appendChild(productCard.firstElementChild);
        });
        
        // Initialize cart functionality for add to cart buttons
        if (window.ShubhamCart) {
            window.ShubhamCart.init();
        }
    },
    
    /**
     * Initialize product filtering and sorting
     * @param {string} productsContainerId - ID of products container
     * @param {string} filtersContainerId - ID of filters container
     * @param {string} sortSelectId - ID of sort select element
     */
    initProductFiltering: function(productsContainerId, filtersContainerId, sortSelectId) {
        const filtersContainer = document.getElementById(filtersContainerId);
        const sortSelect = document.getElementById(sortSelectId);
        if (!filtersContainer || !sortSelect) return;
        
        const allProducts = this.getAllProducts();
        let filteredProducts = [...allProducts];
        
        // Render category filters
        const categories = this.getUniqueCategories();
        const categoryFiltersHtml = categories.map(category => `
            <div class="flex items-center mb-2">
                <input type="checkbox" id="category-${category.toLowerCase().replace(/\s+/g, '-')}" 
                       data-filter="category" data-value="${category}" class="mr-2">
                <label for="category-${category.toLowerCase().replace(/\s+/g, '-')}">${category}</label>
            </div>
        `).join('');
        
        // Render price range filter
        const priceRange = this.getPriceRange();
        const priceFilterHtml = `
            <div class="mb-4">
                <label for="price-min" class="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input type="number" id="price-min" min="${priceRange.min}" max="${priceRange.max}" 
                       value="${priceRange.min}" class="w-full border rounded px-2 py-1">
            </div>
            <div class="mb-4">
                <label for="price-max" class="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input type="number" id="price-max" min="${priceRange.min}" max="${priceRange.max}" 
                       value="${priceRange.max}" class="w-full border rounded px-2 py-1">
            </div>
        `;
        
        // Render filters
        filtersContainer.innerHTML = `
            <div class="mb-6">
                <h3 class="text-lg font-medium mb-3">Categories</h3>
                ${categoryFiltersHtml}
            </div>
            <div class="mb-6">
                <h3 class="text-lg font-medium mb-3">Price Range</h3>
                ${priceFilterHtml}
            </div>
        `;
        
        // Add event listeners for filters
        const categoryCheckboxes = filtersContainer.querySelectorAll('[data-filter="category"]');
        const priceMinInput = document.getElementById('price-min');
        const priceMaxInput = document.getElementById('price-max');
        
        // Function to apply filters
        const applyFilters = () => {
            // Get selected categories
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.getAttribute('data-value'));
            
            // Get price range
            const minPrice = parseFloat(priceMinInput.value) || priceRange.min;
            const maxPrice = parseFloat(priceMaxInput.value) || priceRange.max;
            
            // Filter products
            filteredProducts = allProducts;
            
            // Apply category filter
            if (selectedCategories.length > 0) {
                filteredProducts = filteredProducts.filter(product => 
                    selectedCategories.includes(product.category)
                );
            }
            
            // Apply price filter
            filteredProducts = this.filterByPriceRange(filteredProducts, minPrice, maxPrice);
            
            // Apply sorting
            const sortBy = sortSelect.value;
            filteredProducts = this.sortProducts(filteredProducts, sortBy);
            
            // Render filtered products
            this.renderProductGrid(filteredProducts, productsContainerId);
        };
        
        // Add event listeners
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        priceMinInput.addEventListener('change', applyFilters);
        priceMaxInput.addEventListener('change', applyFilters);
        sortSelect.addEventListener('change', applyFilters);
        
        // Initial render
        this.renderProductGrid(allProducts, productsContainerId);
    }
};

// Export ProductUtils object for use in other scripts
window.ShubhamProductUtils = ProductUtils;