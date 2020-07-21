const mongoose = require('mongoose');
const uuid = require('node-uuid');
const BookmarkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  time_created: {
    type: Number,
    default: new Date().getTime(),
  },
  time_updated: {
    type: Number,
    default: new Date().getTime(),
  },
  publisher: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      ref: 'tag',
    },
  ],
});

module.exports = Bookmark = mongoose.model('bookmark', BookmarkSchema);
