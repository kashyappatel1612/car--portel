const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const listingRoutes = require('./routes/listingRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const advisorRoutes = require('./routes/advisorRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const priceHistoryRoutes = require('./routes/priceHistoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Global Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AutoSmart AI Backend', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/advisor', advisorRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/price-history', priceHistoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Global Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
