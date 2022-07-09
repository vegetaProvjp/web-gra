const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  name: { type: String },
  image: [],
}, {
  collection: 'product'
});

module.exports = mongoose.model("product", Schema);
