const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const albumSchema = new Schema({
  name: String,
  year: Number,
  artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
});

module.exports = mongoose.model('Album', albumSchema);
