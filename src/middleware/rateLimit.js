// middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

module.exports = limiter;
