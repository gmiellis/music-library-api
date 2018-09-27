const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { getAlbums } = require('../../controllers/album');
const Artist = require('../../models/artist');
const Album = require('../../models/album');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('GET Artist Album list', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });
  it('should get an artists albums', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((artistCreatedError, artistCreated) => {
      if (artistCreatedError) {
        console.log(artistCreatedError, 'artistCreatedError');
      }

      const albums = [
        { name: 'Mylo Xyloto', year: 2011, artist },
        { name: 'Ghost Stories', year: 2014, artist },
      ];

      Album.insertMany(albums, (albumErr, albumsCreated) => {
        if (albumErr) {
          console.log('error inserting albums');
        }

        const request = httpMocks.createRequest({
          method: 'GET',
          URL: `/Artist/${artistCreated._id}/albums`,
          params: {
            artistId: artistCreated._id.toString(),
          },
        });

        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });

        getAlbums(request, response);
        response.on('end', () => {
          const albumsFound = response._getData();
          expect(albumsFound).toEqual(JSON.stringify(albumsCreated));
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
      Album.collection.drop((e) => {
        if (e) {
          console.log(e);
        }
        done();
      });
    });
  });
  afterAll((done) => {
    mongoose.connection.close();
    done();
  });
});
