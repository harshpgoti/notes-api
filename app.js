const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./src/db');
const limiter = require('./src/middleware/rateLimit'); 

const authRoutes = require('./src/routes/auth');
const noteRoutes = require('./src/routes/notes');
const searchRoutes = require('./src/routes/search');

app.use(express.json());
app.use(limiter);
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', searchRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app
