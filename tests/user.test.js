const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app } = require('../index');
const { expect } = chai;

console.log = () => {};

chai.use(chaiHttp);

describe('/users route', () => {
  describe('GET /:id', async () => {
    it('should return user by id', async () => {
      const userId = 'c486ab55-5c4b-4689-8f57-ace155ea65b4';
      const { status, body } = await chai.request(app).get(`/users/${userId}`);
      expect(status).to.be.equal(200);
      expect(body.id).to.be.equal(userId);
      expect(body.name).to.be.equal('Alex');
      expect(body.type).to.be.equal('client');
    });

    it('should return status 404 if user is not found', async () => {
      const userId = '79829044-086e-4d8f-8538-23a4b28ae00f';
      const { status, body } = await chai.request(app).get(`/users/${userId}`);
      expect(status).to.be.equal(404);
      expect(body.error).to.be.equal('User not found');
    });

    it('should return status 400 if userId is not UUID', async () => {
      const userId = '12345';
      const { status, body } = await chai.request(app).get(`/users/${userId}`);
      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal('"id" must be a valid GUID');
    });
  });

  describe('PUT /:id', async () => {
    it('should update user by id', async () => {
      const userId = '0f290598-1b54-4a36-8c58-33caa7d08b5f';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

      const { status, body } = await chai
        .request(app)
        .put(`/users/${userId}`)
        .set('authorization', `Bearer ${token}`)
        .send({ name: 'Oleg' });

      expect(status).to.be.equal(200);
      expect(body.id).to.be.equal(userId);
      expect(body.name).to.be.equal('Oleg');
    });

    it('should return status 401 if authorization header is missing', async () => {
      const userId = '0f290598-1b54-4a36-8c58-33caa7d08b5f';

      const { status, body } = await chai
        .request(app)
        .put(`/users/${userId}`)
        .send({ name: 'Oleg' });

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal('Not Authorized');
    });

    it('should return status 401 if token is not valid', async () => {
      const userId = '0f290598-1b54-4a36-8c58-33caa7d08b5f';
      const token = jwt.sign(
        { id: userId },
        `invalid_${process.env.JWT_SECRET}`
      );

      const { status, body } = await chai
        .request(app)
        .put(`/users/${userId}`)
        .set('authorization', `Bearer ${token}`)
        .send({ name: 'Oleg' });

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal('Not Authorized');
    });

    it('should return status 400 if userId is not UUID', async () => {
      const userId = '12345';
      const { status, body } = await chai.request(app).get(`/users/${userId}`);
      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal('"id" must be a valid GUID');
    });

    it('should return status 400 if payload has "balance" field', async () => {
      const userId = '0f290598-1b54-4a36-8c58-33caa7d08b5f';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

      const { status, body } = await chai
        .request(app)
        .put(`/users/${userId}`)
        .set('authorization', `Bearer ${token}`)
        .send({ balance: 100 });

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal('"balance" is not allowed');
    });

    it('should return status 401 if userId from token is different than in params', async () => {
      const userId = '0f290598-1b54-4a36-8c58-33caa7d08b5f';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

      const { status, body } = await chai
        .request(app)
        .put('/users/d0bb4a01-58b7-4b96-81d2-e881b6a2a886')
        .set('authorization', `Bearer ${token}`)
        .send({ name: 'Ivan' });

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal('UserId mismatch');
    });

    it('should return status 400 if email is not unique', async () => {
      const userId = '0f290598-1b54-4a36-8c58-33caa7d08b5f';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

      const { status, body } = await chai
        .request(app)
        .put(`/users/${userId}`)
        .set('authorization', `Bearer ${token}`)
        .send({ email: 'alex@gmail.com' });

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal(
        'Key (email)=(alex@gmail.com) already exists.'
      );
    });
  });

  describe('POST /', async () => {
    it('should create new user', async () => {
      const user = {
        id: 'c72a8525-879a-4e66-861e-d8e6e493b159',
        type: 'client',
        phone: '380432114467',
        name: 'Roman',
        email: 'roman@gmail.com',
      };

      const { status, body } = await chai
        .request(app)
        .post('/users')
        .send(user);

      expect(status).to.be.equal(200);
      expect(body).to.include.all.keys(
        'id',
        'type',
        'phone',
        'name',
        'email',
        'city',
        'balance',
        'createdAt',
        'updatedAt',
        'accessToken'
      );
      expect(body.balance).to.be.equal(0);
    });

    it('should return status 400 if phone has invalid format', async () => {
      const user = {
        id: 'c72a8525-879a-4e66-861e-d8e6e493b159',
        type: 'client',
        phone: '3804321144670',
        name: 'Roman',
        email: 'roman@gmail.com',
      };

      const { status, body } = await chai
        .request(app)
        .post('/users')
        .send(user);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal(
        '"phone" with value "3804321144670" fails to match the required pattern: /^\\+?3?8?(0\\d{9})$/'
      );
    });

    it('should return status 400 if phone is not unique', async () => {
      const user = {
        id: '843abc9c-8a00-4326-a7ee-2526c733fa08',
        type: 'client',
        phone: '380952768899',
        name: 'Vika',
        email: 'vika@gmail.com',
      };

      const { status, body } = await chai
        .request(app)
        .post('/users')
        .send(user);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal(
        'Key (phone)=(380952768899) already exists.'
      );
    });
  });
});
