const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Artist = require('./controllers/artist');
const Album = require('./controllers/album');
const Song = require('./controllers/song');


require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

const app = express();
mongoose.connect(
  process.env.DATABASE_CONN,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello MongoDb!'));
app.post('/artist', Artist.post);
app.get('/artist/', Artist.list);
app.get('/artist/:artistId', Artist.get);
app.put('/artist/:artistId', Artist.put);
app.delete('/artist/:artistId', Artist.deleteArtist);
app.post('/artist/:artistId/albums', Album.postAlbum);
app.post('/album/:albumId/song', Song.postSong);
app.get('/artist/:artistId/albums', Album.getAlbums);

app.listen(3000, () => console.log('It works!'));
