const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { post } = require('../../controllers/artist');
const Artist = require('../../models/artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist POST Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });
  it('should create a new Artist', (done) => {
    expect.assertions(2);
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/Artist',
      body: {
        name: 'Gold Panda',
        genre: 'Ambient',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: events.EventEmitter,
    });
    post(request, response);
    response.on('end', () => {
      const artistCreated = JSON.parse(response._getData());
      expect(artistCreated.name).toBe('Gold Panda');
      expect(artistCreated.genre).toBe('Ambient');
      done();
    });
  });
  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });
  afterAll((done) => {
    mongoose.connection.close();
    done();
  });
});
