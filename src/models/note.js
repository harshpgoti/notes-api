// models/note.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
