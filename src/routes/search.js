//route/search.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');
const authenticate = require('../middleware/authUser');

// Middleware to authenticate endpoints
router.use(authenticate);

// Search for notes based on keywords for the authenticated user
router.get('/search', async (req, res) => {
    try {
      const query = req.query.q;
  
      // Perform the search based on the query (using MongoDB's text search)
      const searchResults = await Note.find(
        { $text: { $search: query }, owner: req.userId },
        { score: { $meta: 'textScore' } } // Include the search score in the result
      ).sort({ score: { $meta: 'textScore' } }); // Sort results by the search score
  
      res.json(searchResults);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong11' });
    }
});

module.exports = router;