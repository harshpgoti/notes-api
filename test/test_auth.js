//test/test_auth.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../src/models/user');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Authentication Endpoints', () => {
  before(async () => {
    await User.deleteOne({ username: 'testuser' });

  });

  it('should create a new user', (done) => {
    chai
      .request(app)
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message', 'User created successfully');
        done();
      });
  });

  it('should log in an existing user and return an access token', (done) => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('accessToken');
        done();
      });
  });
});
