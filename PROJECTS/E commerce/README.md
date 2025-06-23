# Shubham Enterprise - UPI Payment System

A complete e-commerce website with integrated Cashfree UPI payment system for Shubham Enterprise.

## Features

### Frontend
- **Modern UI**: Built with HTML5, TailwindCSS, and Font Awesome icons
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Shopping Cart**: Add/remove products with localStorage persistence
- **Checkout Process**: Complete order form with business information
- **UPI Payment Integration**: Smart UPI button with Cashfree SDK
- **QR Code Fallback**: Static QR code for manual UPI payments
- **Toast Notifications**: Real-time feedback for user actions
- **WhatsApp Integration**: Quote request fallback option

### Backend (Node.js + Express)
- **RESTful API**: Clean API endpoints for order management
- **Cashfree Integration**: Secure payment session creation
- **MongoDB Integration**: Order persistence with Mongoose
- **Input Validation**: Comprehensive request validation with Joi
- **Security**: Rate limiting, CORS, helmet protection
- **Webhook Support**: Payment status updates from Cashfree
- **Error Handling**: Comprehensive error management

### Database (MongoDB)
- **Order Schema**: Complete order tracking with payment status
- **Customer Information**: Secure storage of customer details
- **Payment Tracking**: Cashfree transaction mapping
- **Business Logic**: Automatic status updates and timestamps

## Tech Stack

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript, Font Awesome
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Payment Gateway**: Cashfree Payment Gateway (Sandbox)
- **Validation**: Joi validation library
- **Security**: Helmet, CORS, Express Rate Limit
- **Development**: Nodemon for auto-restart

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cashfree account (for API keys)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   - Copy `.env.example` to `.env`
   - Update the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/shubham-enterprise
   
   # Cashfree Configuration (Sandbox)
   CASHFREE_APP_ID=your_cashfree_app_id
   CASHFREE_SECRET_KEY=your_cashfree_secret_key
   CASHFREE_API_VERSION=2023-08-01
   CASHFREE_ENVIRONMENT=sandbox
   
   # UPI Configuration
   UPI_ID=yourupiid@okaxis
   UPI_MERCHANT_NAME=Shubham Enterprise
   
   # Frontend Configuration
   FRONTEND_URL=http://localhost:5500
   ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
   
   # Webhook Configuration
   WEBHOOK_SECRET=your_webhook_secret_key
   
   # Security
   JWT_SECRET=your_jwt_secret_key
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the backend server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will start on `http://localhost:3000`

### Frontend Setup

1. **Open the project in a web server**:
   - Use Live Server extension in VS Code
   - Or use Python: `python -m http.server 5500`
   - Or use Node.js: `npx serve -p 5500`

2. **Access the website**:
   - Homepage: `http://localhost:5500/index.html`
   - Products: `http://localhost:5500/products.html`
   - Cart: `http://localhost:5500/cart.html`
   - Checkout: `http://localhost:5500/checkout.html`

### Cashfree Setup

1. **Create Cashfree Account**:
   - Sign up at [Cashfree Dashboard](https://merchant.cashfree.com/)
   - Get your App ID and Secret Key from the sandbox environment

2. **Configure Webhook URL** (Optional):
   - In Cashfree dashboard, set webhook URL to: `http://your-domain.com/api/webhooks/cashfree`
   - For local testing, use ngrok: `https://your-ngrok-url.ngrok.io/api/webhooks/cashfree`

## API Endpoints

### Payment Endpoints
- `POST /api/cashfree/pay` - Create payment session
- `GET /api/cashfree/status/:orderId` - Check payment status
- `GET /api/cashfree/upi-link/:orderId` - Generate UPI QR code

### Order Management
- `GET /api/orders` - Get all orders (with pagination)
- `GET /api/orders/:orderId` - Get specific order
- `PUT /api/orders/:orderId/status` - Update order status
- `GET /api/orders/customer/:email` - Get customer orders
- `GET /api/orders/stats` - Get order statistics

### Webhooks
- `POST /api/webhooks/cashfree` - Cashfree payment notifications
- `GET /api/webhooks/health` - Webhook health check

## Testing

### Test Payment Flow

1. **Add products to cart** on the products page
2. **Proceed to checkout** and fill in the form
3. **Select UPI payment** method
4. **Click "Pay with UPI"** button
5. **Use test UPI IDs**:
   - Success: `success@upi`
   - Failure: `fail@upi`

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Create test order
curl -X POST http://localhost:3000/api/cashfree/pay \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "amount": 500,
    "items": [{"name": "Test Product", "quantity": 1, "price": 500}]
  }'
```

## Security Features

- **Input Validation**: All inputs validated with Joi schemas
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers for Express
- **Environment Variables**: Sensitive data in environment files
- **Webhook Verification**: Cashfree signature verification
- **Error Handling**: Comprehensive error management

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Update Cashfree to production environment
- Set proper CORS origins
- Use HTTPS for webhook URLs

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Database**: MongoDB Atlas, AWS DocumentDB

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `ALLOWED_ORIGINS` in `.env`
   - Ensure frontend URL matches the allowed origins

2. **Payment Session Creation Fails**:
   - Verify Cashfree API credentials
   - Check if amount is above minimum (₹1)
   - Ensure all required fields are provided

3. **MongoDB Connection Issues**:
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

4. **Webhook Not Receiving**:
   - Use ngrok for local testing
   - Verify webhook URL in Cashfree dashboard
   - Check webhook secret configuration

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=cashfree:*
```

## Support

For issues and questions:
- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Test with Cashfree sandbox credentials first
- Use browser developer tools to debug frontend issues

## License

This project is for educational and commercial use by Shubham Enterprise.

---

**Note**: This is a complete UPI payment integration with Cashfree. Make sure to test thoroughly in sandbox environment before going live.