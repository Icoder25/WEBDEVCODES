/**
 * Authentication functionality for Shubham Enterprise E-commerce Platform
 * Handles user registration, login, logout, and session management
 */

const Auth = {
    /**
     * Get current user from localStorage
     * @returns {Object|null} - User object or null if not logged in
     */
    getCurrentUser: function() {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    },
    
    /**
     * Check if user is logged in
     * @returns {boolean} - True if user is logged in, false otherwise
     */
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },
    
    /**
     * Get all users from localStorage
     * @returns {Array} - Array of user objects
     */
    getUsers: function() {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
    },
    
    /**
     * Save users to localStorage
     * @param {Array} users - Array of user objects to save
     */
    saveUsers: function(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    
    /**
     * Register a new user
     * @param {Object} userData - User data including name, email, password, etc.
     * @returns {Object} - Result object with success status and message
     */
    register: function(userData) {
        if (!userData.email || !userData.password || !userData.name) {
            return {
                success: false,
                message: 'Please provide all required fields'
            };
        }
        
        const users = this.getUsers();
        
        // Check if email already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            return {
                success: false,
                message: 'Email already registered'
            };
        }
        
        // Create new user object
        const newUser = {
            id: 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // In a real app, this should be hashed
            phone: userData.phone || '',
            company: userData.company || '',
            gst: userData.gst || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            pincode: userData.pincode || '',
            role: 'customer',
            createdAt: new Date().toISOString(),
            orders: [],
            wishlist: [],
            creditStatus: 'pending', // pending, approved, rejected
            creditLimit: 0
        };
        
        // Add user to users array
        users.push(newUser);
        this.saveUsers(users);
        
        // Auto login after registration
        this.setCurrentUser(newUser);
        
        return {
            success: true,
            message: 'Registration successful',
            user: newUser
        };
    },
    
    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} - Result object with success status and message
     */
    login: function(email, password) {
        if (!email || !password) {
            return {
                success: false,
                message: 'Please provide email and password'
            };
        }
        
        const users = this.getUsers();
        
        // Find user by email and password
        const user = users.find(user => 
            user.email === email && user.password === password
        );
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        
        // Set current user in localStorage
        this.setCurrentUser(user);
        
        return {
            success: true,
            message: 'Login successful',
            user: user
        };
    },
    
    /**
     * Set current user in localStorage
     * @param {Object} user - User object to set as current user
     */
    setCurrentUser: function(user) {
        // Remove password before storing in localStorage
        const userToStore = { ...user };
        delete userToStore.password;
        
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        
        // Dispatch event for other parts of the app to know user has logged in
        const event = new CustomEvent('userLogin', { detail: userToStore });
        document.dispatchEvent(event);
    },
    
    /**
     * Logout current user
     */
    logout: function() {
        const user = this.getCurrentUser();
        localStorage.removeItem('currentUser');
        
        // Dispatch event for other parts of the app to know user has logged out
        const event = new CustomEvent('userLogout', { detail: user });
        document.dispatchEvent(event);
        
        // Redirect to home page or login page
        window.location.href = 'index.html';
    },
    
    /**
     * Update current user profile
     * @param {Object} userData - Updated user data
     * @returns {Object} - Result object with success status and message
     */
    updateProfile: function(userData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Not logged in'
            };
        }
        
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        
        // Update user data
        const updatedUser = {
            ...users[userIndex],
            name: userData.name || users[userIndex].name,
            phone: userData.phone || users[userIndex].phone,
            company: userData.company || users[userIndex].company,
            gst: userData.gst || users[userIndex].gst,
            address: userData.address || users[userIndex].address,
            city: userData.city || users[userIndex].city,
            state: userData.state || users[userIndex].state,
            pincode: userData.pincode || users[userIndex].pincode
        };
        
        // Update password if provided
        if (userData.password) {
            updatedUser.password = userData.password;
        }
        
        // Save updated user
        users[userIndex] = updatedUser;
        this.saveUsers(users);
        
        // Update current user
        this.setCurrentUser(updatedUser);
        
        return {
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        };
    },
    
    /**
     * Check if user has admin role
     * @returns {boolean} - True if user is admin, false otherwise
     */
    isAdmin: function() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },
    
    /**
     * Admin login
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     * @returns {Object} - Result object with success status and message
     */
    adminLogin: function(username, password) {
        // In a real app, this would check against a database
        // For demo purposes, we'll use hardcoded credentials
        if (username === 'admin' && password === 'admin123') {
            const adminUser = {
                id: 'admin_1',
                name: 'Admin User',
                email: 'admin@shubhamenterprises.com',
                role: 'admin'
            };
            
            this.setCurrentUser(adminUser);
            
            return {
                success: true,
                message: 'Admin login successful',
                user: adminUser
            };
        }
        
        return {
            success: false,
            message: 'Invalid admin credentials'
        };
    },
    
    /**
     * Initialize authentication functionality
     */
    init: function() {
        // Check if users array exists in localStorage
        if (!localStorage.getItem('users')) {
            // Initialize with empty array
            this.saveUsers([]);
        }
        
        // Add event listener for logout buttons
        document.addEventListener('DOMContentLoaded', () => {
            const logoutButtons = document.querySelectorAll('[data-logout]');
            logoutButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            });
            
            // Update UI based on login status
            this.updateAuthUI();
        });
    },
    
    /**
     * Update UI elements based on authentication status
     */
    updateAuthUI: function() {
        const isLoggedIn = this.isLoggedIn();
        const isAdmin = this.isAdmin();
        const currentUser = this.getCurrentUser();
        
        // Elements to show/hide based on login status
        const loggedInElements = document.querySelectorAll('[data-logged-in]');
        const loggedOutElements = document.querySelectorAll('[data-logged-out]');
        const adminElements = document.querySelectorAll('[data-admin-only]');
        const userNameElements = document.querySelectorAll('[data-user-name]');
        
        // Show/hide elements based on login status
        loggedInElements.forEach(el => {
            el.style.display = isLoggedIn ? '' : 'none';
        });
        
        loggedOutElements.forEach(el => {
            el.style.display = isLoggedIn ? 'none' : '';
        });
        
        adminElements.forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });
        
        // Update user name elements
        if (isLoggedIn && currentUser) {
            userNameElements.forEach(el => {
                el.textContent = currentUser.name;
            });
        }
    }
};

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Export Auth object for use in other scripts
window.ShubhamAuth = Auth;