const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  path: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
    default: "no details available",
  },
});

module.exports = mongoose.model("Products", schema);
