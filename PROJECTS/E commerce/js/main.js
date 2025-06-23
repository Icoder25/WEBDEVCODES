/**
 * Main JavaScript file for Shubham Enterprise E-commerce Platform
 * Contains common functionality used across multiple pages
 */

// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const closeMenuButton = document.getElementById('close-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const cartCountElements = document.querySelectorAll('.cart-count');

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    if (mobileMenuButton && closeMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
        
        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }
}

/**
 * Update cart count from localStorage
 */
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    cartCountElements.forEach(element => {
        element.textContent = cartItems.length;
    });
}

/**
 * Format currency (INR)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Calculate GST amount (18%)
 * @param {number} amount - The base amount
 * @returns {number} - GST amount
 */
function calculateGST(amount) {
    return amount * 0.18;
}

/**
 * Show toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Set background color based on type
    let bgColor, iconClass;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-100 border-green-400 text-green-700';
            iconClass = 'fas fa-check-circle text-green-500';
            break;
        case 'error':
            bgColor = 'bg-red-100 border-red-400 text-red-700';
            iconClass = 'fas fa-times-circle text-red-500';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100 border-yellow-400 text-yellow-700';
            iconClass = 'fas fa-exclamation-circle text-yellow-500';
            break;
        default: // info
            bgColor = 'bg-blue-100 border-blue-400 text-blue-700';
            iconClass = 'fas fa-info-circle text-blue-500';
    }
    
    toast.className = `toast ${bgColor} border-l-4 p-4 mb-4 rounded shadow-md`;
    
    // Toast content
    toast.innerHTML = `
        <div class="flex items-center">
            <div class="mr-3">
                <i class="${iconClass} text-lg"></i>
            </div>
            <div>
                <p>${message}</p>
            </div>
            <div class="ml-auto pl-3">
                <button class="toast-close">
                    <i class="fas fa-times text-gray-400 hover:text-gray-600"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Add close button functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        toast.remove();
    });
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/**
 * Show modal
 * @param {string} modalId - The ID of the modal to show
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-backdrop');
    
    if (modal && backdrop) {
        modal.classList.add('show');
        backdrop.classList.add('show');
        document.body.classList.add('overflow-hidden');
    }
}

/**
 * Hide modal
 * @param {string} modalId - The ID of the modal to hide
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-backdrop');
    
    if (modal && backdrop) {
        modal.classList.remove('show');
        backdrop.classList.remove('show');
        document.body.classList.remove('overflow-hidden');
    }
}

/**
 * Initialize modals
 */
function initModals() {
    // Create backdrop if it doesn't exist
    let backdrop = document.getElementById('modal-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'modal-backdrop';
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);
    }
    
    // Add click event to backdrop to close modals
    backdrop.addEventListener('click', () => {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            modal.classList.remove('show');
        });
        backdrop.classList.remove('show');
        document.body.classList.remove('overflow-hidden');
    });
    
    // Add click event to all modal close buttons
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                backdrop.classList.remove('show');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });
}

/**
 * Toggle password visibility
 * @param {string} inputId - The ID of the password input
 * @param {string} toggleId - The ID of the toggle button
 */
function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleId);
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = toggleButton.querySelector('i');
            if (icon) {
                if (type === 'password') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            }
        });
    }
}

/**
 * Initialize FAQ accordions
 */
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        
        if (header && content && icon) {
            header.addEventListener('click', () => {
                // Toggle current item
                content.classList.toggle('hidden');
                
                // Toggle icon
                if (content.classList.contains('hidden')) {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                } else {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            });
        }
    });
}

/**
 * Initialize quantity input with increment/decrement buttons
 * @param {string} inputId - The ID of the quantity input
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 */
function initQuantityInput(inputId, min = 1, max = 100) {
    const quantityInput = document.getElementById(inputId);
    const decrementBtn = document.querySelector(`[data-quantity-decrease="${inputId}"]`);
    const incrementBtn = document.querySelector(`[data-quantity-increase="${inputId}"]`);
    
    if (quantityInput && decrementBtn && incrementBtn) {
        // Set initial value and attributes
        quantityInput.value = Math.max(min, parseInt(quantityInput.value) || min);
        quantityInput.setAttribute('min', min);
        if (max) quantityInput.setAttribute('max', max);
        
        // Decrement button
        decrementBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value) || 0;
            if (currentValue > min) {
                quantityInput.value = currentValue - 1;
                // Trigger change event
                quantityInput.dispatchEvent(new Event('change'));
            }
        });
        
        // Increment button
        incrementBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value) || 0;
            if (!max || currentValue < max) {
                quantityInput.value = currentValue + 1;
                // Trigger change event
                quantityInput.dispatchEvent(new Event('change'));
            }
        });
        
        // Input validation
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value) || 0;
            value = Math.max(min, value);
            if (max) value = Math.min(max, value);
            quantityInput.value = value;
        });
    }
}

/**
 * Get URL parameters
 * @returns {Object} - Object containing URL parameters
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

/**
 * Smooth scroll to element
 * @param {string} elementId - The ID of the element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 100, // Offset for header
            behavior: 'smooth'
        });
    }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Update cart count
    updateCartCount();
    
    // Initialize modals
    initModals();
    
    // Initialize FAQ accordions if they exist
    initFaqAccordions();
});

// Export functions for use in other scripts
window.shubhamEnterprise = {
    showToast,
    showModal,
    hideModal,
    formatCurrency,
    calculateGST,
    togglePasswordVisibility,
    initQuantityInput,
    getUrlParams,
    scrollToElement
};