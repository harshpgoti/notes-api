const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI,{
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

const db = mongoose.connection;

module.exports = db;
