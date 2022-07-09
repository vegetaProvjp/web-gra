const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  image: [],
}, {
  collection: 'user'
});

module.exports = mongoose.model("user", userSchema);
