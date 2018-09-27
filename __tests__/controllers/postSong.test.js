const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postSong } = require('../../controllers/song');
const Artist = require('../../models/artist');
const Album = require('../../models/album');
const Song = require('../../models/song');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('POST song endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });
  it('should add a song to an album', (done) => {
    const artist = new Artist({ name: 'Coldplay', genre: 'sad' });
    artist.save((artistCreateError, artistCreated) => {
      if (artistCreateError) {
        console.log(artistCreateError);
      }

      const album = new Album({
        name: 'Ghost Stories',
        year: '2014',
        artist: artistCreated,
      });
      album.save((albumCreateError, albumCreated) => {
        if (albumCreateError) {
          console.log(albumCreateError);
        }

        const request = httpMocks.createRequest({
          method: 'POST',
          url: `/album/${albumCreated._id}/song`,
          params: {
            albumId: albumCreated._id,
          },
          body: {
            name: 'A Sky Full of Stars',
            artistId: artistCreated._id,
          },
        });

        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });

        postSong(request, response);

        response.on('end', () => {
          const songCreated = JSON.parse(response._getData());
          expect(songCreated.name).toEqual('A Sky Full of Stars');
          expect(songCreated.artist._id).toEqual(artistCreated._id.toString());
          expect(songCreated.album._id).toEqual(albumCreated._id.toString());
          done();
        });
      });
    });
  });
  afterEach((done) => {
    Artist.collection.drop((artistDropErr) => {
      Album.collection.drop((albumDropErr) => {
        Song.collection.drop((songDropErr) => {
          if (artistDropErr || albumDropErr || songDropErr) {
            console.log('Can not drop test collections');
          }
          done();
        });
      });
    });
  });
  afterAll(() => {
    mongoose.connection.close();
  });
});
