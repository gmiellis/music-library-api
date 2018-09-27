const Artist = require('../models/artist');
const Album = require('../models/album');

exports.postAlbum = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Artist does not exist');
    }

    const myAlbum = new Album({
      artist,
      name: req.body.name,
      year: req.body.year,
    });

    myAlbum.save((createErr, createdAlbum) => {
      if (createErr) {
        res.json('Could not create an album');
      }
      res.json(createdAlbum);
    });
  });
};

exports.getAlbums = (req, res) => {
  Artist.find({ artist: req.params.artistId }).populate('artist').exec((err, albums) => {
    if (err) {
      res.json('Unable to retrieve albums');
    }

    res.json(albums);
  });
};
