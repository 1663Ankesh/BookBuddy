const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  booktitle: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  isbooked: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("books", bookSchema);
