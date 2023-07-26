//routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');
const authenticate = require('../middleware/authUser');

// Middleware to authenticate endpoints
router.use(authenticate);

// Get all notes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a note by ID for the authenticated user
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Create a new note for the authenticated user
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content, owner: req.userId });
    await newNote.save();
    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update an existing note by ID for the authenticated user
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { title, content },
      { new: true } // Return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete a note by ID for the authenticated user
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Share a note with another user for the authenticated user
router.post('/:id/share', async (req, res) => {
  try {
    const noteId = req.params.id;
    const { recipientUserId } = req.body;
    
    const note = await Note.findOne({ _id: noteId, owner: req.userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const recipientUser = await User.findById(recipientUserId);
    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    if (note.sharedWith.includes(recipientUserId)) {
      return res.status(409).json({ error: 'Note already shared with this user' });
    }

    note.sharedWith.push(recipientUserId);
    await note.save();

    res.json({ message: 'Note shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});



module.exports = router;
