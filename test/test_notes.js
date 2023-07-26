//test/test_notes.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../src/models/user');
const Note = require('../src/models/note');

const { expect } = chai;
chai.use(chaiHttp);

describe('Note Endpoints', () => {
  let authToken;
  let testUser;
  let testNote;

  before(async () => {

    await User.deleteOne({ username: "shareuser" });
    await User.deleteOne({ username: "shareuser2" });
    await Note.deleteOne({ title: "Test Note" });
    
    const response = await chai
      .request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    authToken = response.body.accessToken;
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('GET /api/notes', () => {
    it('should get all notes for the authenticated user', async () => {
      const res = await chai
        .request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note for the authenticated user', async () => {
      const newNote = { title: 'Test Note', content: 'This is a test note.' };

      const res = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message').to.equal('Note created successfully');
      expect(res.body).to.have.property('note').to.be.an('object');
      expect(res.body.note).to.have.property('title').to.equal(newNote.title);
      expect(res.body.note).to.have.property('content').to.equal(newNote.content);

      testNote = res.body.note;
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a note by ID for the authenticated user', async () => {
      const res = await chai
        .request(app)
        .get(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('title').to.equal(testNote.title);
      expect(res.body).to.have.property('content').to.equal(testNote.content);
    });

    it('should return 404 if note ID does not exist', async () => {
      const res = await chai
        .request(app)
        .get('/api/notes/123456789012345678901234')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update an existing note by ID for the authenticated user', async () => {
      const updatedNote = { title: 'Updated Note', content: 'This is an updated test note.' };

      const res = await chai
        .request(app)
        .put(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedNote);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.equal('Note updated successfully');
      expect(res.body).to.have.property('note').to.be.an('object');
      expect(res.body.note).to.have.property('title').to.equal(updatedNote.title);
      expect(res.body.note).to.have.property('content').to.equal(updatedNote.content);
    });

    it('should return 404 if note ID does not exist', async () => {
      const res = await chai
        .request(app)
        .put('/api/notes/123456789012345678901234')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Note', content: 'This is an updated test note.' });

      expect(res).to.have.status(404);
    });
  });

  describe('POST /api/notes/:id/share', () => {
    it('should share a note with another user for the authenticated user', async () => {
      
      const shareUser = await User.create({ username: 'shareuser', password: 'sharepassword' });
      
      const res = await chai
        .request(app)
        .post(`/api/notes/${testNote._id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ recipientUserId: shareUser._id });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.equal('Note shared successfully');
    });

    it('should return 404 if note ID or recipient user ID does not exist', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes/123456789012345678901234/share')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ recipientUserId: '123456789012345678901234' });

      expect(res).to.have.status(404);
    });

    it('should return 409 if the note is already shared with the recipient user', async () => {
      
      const shareUser = await User.create({ username: 'shareuser2', password: 'sharepassword2' });

      await chai
        .request(app)
        .post(`/api/notes/${testNote._id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ recipientUserId: shareUser._id });

      const res = await chai
        .request(app)
        .post(`/api/notes/${testNote._id}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ recipientUserId: shareUser._id });

      expect(res).to.have.status(409);
    });
  });

  describe('GET /api/search?q=:query', () => {
    it('should search for notes based on keywords for the authenticated user', async () => {
      const query = 'Updated Note'; // Replace with a valid keyword for searching
      
      const res = await chai
        .request(app)
        .get('/api/search')
        .query({ q: query }) // Add the query parameter to the request
        .set('Authorization', `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      // Add more assertions based on your expected search results
    });

    it('should return an empty array if no matching notes are found', async () => {
      const query = 'nonexistent'; // Replace with a keyword that won't match any notes
      
      const res = await chai
        .request(app)
        .get('/api/search')
        .query({ q: query }) // Add the query parameter to the request
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note by ID for the authenticated user', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').to.equal('Note deleted successfully');
    });

    it('should return 404 if note ID does not exist', async () => {
      const res = await chai
        .request(app)
        .delete('/api/notes/123456789012345678901234')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(404);
    });
  });

});
