const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { get } = require('../../controllers/artist');
const Artist = require('../../models/artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist GET Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });

  it('should retrieve Artist record from database', (done) => {
    const artist = new Artist({ name: 'Wu-Tang Clan', genre: 'HipHop' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/Artist',
        params: {
          artistId: artistCreated._id,
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      get(request, response);

      response.on('end', () => {
        const artistFound = JSON.parse(response._getData());
        expect(artistFound.name).toBe('Wu-Tang Clan');
        expect(artistFound.genre).toBe('HipHop');
        done();
      });
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
