const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { list } = require('../../controllers/artist');
const Artist = require('../../models/artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env'),
});

describe('Artist List GET Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true }, done
    );
  });

  it('should retrieve an Artist List from the database', (done) => {
    const artists = [
      { name: 'tame impala', genre: 'rock' },
      { name: 'jamal', genre: '90s hiphop' },
      { name: 'Jeru the Damaja', genre: '90s hiphop' },
    ];
    Artist.create(artists, (err) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/Artist',
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      list(request, response);
      response.on('end', () => {
        const listOfArtists = JSON.parse(response._getData());
        expect(listOfArtists.map(e => e.name)).toEqual(expect.arrayContaining(['tame impala', 'jamal', 'Jeru the Damaja']));
        expect(listOfArtists).toHaveLength(3);
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
