const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../../controllers/album');
const Artist = require('../../models/artist');
const Album = require('../../models/album');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('update Artist Album', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });
  it('adds an album to an artist', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'Sad' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'POST',
        URL: `/Artist/${artistCreated._id}/Album`,
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Ghost Stories',
          year: 2014,
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      postAlbum(request, response);
      response.on('end', () => {
        const albumCreated = JSON.parse(response._getData());
        expect(albumCreated.name).toEqual('Ghost Stories');
        expect(albumCreated.year).toEqual(2014);
        expect(albumCreated.artist._id).toEqual(artistCreated._id.toString());
        done();
      });
    });
  });
  afterEach((done) => {
    Artist.collection.drop((artistDropErr) => {
      Album.collection.drop((albumDropErr) => {
        if (artistDropErr || albumDropErr) {
          console.log('Can not drop test collections');
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
