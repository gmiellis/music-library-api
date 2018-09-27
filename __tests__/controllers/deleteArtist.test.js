const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../../controllers/artist');
const Artist = require('../../models/artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('delete Artist endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });

  it('Should delete an artist when DELETE endpoint is called', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'Sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'DELETE',
        URL: '/Artist/1234',
        params: {
          artistId: artistCreated._id,
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      deleteArtist(request, response);
      response.on('end', () => {
        Artist.findById(artistCreated._id, (err, noSuchArtist) => {
          expect(noSuchArtist).toBe(null);
          done();
        });
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
