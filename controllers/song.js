const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

exports.postSong = (req, res) => {
  Album.findById(req.params.albumId, (albumNotFoundErr, album) => {
    if (albumNotFoundErr) {
      res.json('Album does not exist');
    }
    Artist.findById(req.body.artistId, (artistNotFoundErr, artist) => {
      if (artistNotFoundErr) {
        res.json('Artist does not exist');
      }
      const mySong = new Song({
        name: req.body.name,
        artist,
        album,
      });

      mySong.save((createErr, createdSong) => {
        if (createErr) {
          res.json('Could not save song');
        }
        res.json(createdSong);
      });
    });
  });
};
