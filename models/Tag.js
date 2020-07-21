const mongoose = require('mongoose');
const uuid = require('node-uuid');

const TagSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4,
  },
  title: {
    type: String,
    unique: true,
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
});

module.exports = Tag = mongoose.model('tag', TagSchema);
