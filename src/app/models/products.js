const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  name_english: { type: String },
  image: [],
  slug: { type: String, slug: "title", unique: true },
  price: { type: String, require: true },
  title: { type: String, require: true },
  quantity: { type: String, require: true },
  description: { type: String },
  //thể loại
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  //người dùng tạo
  // account: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Account',
  //   required: true
  // },
}, {
  collection: 'products'
});

module.exports = mongoose.model("products", userSchema);
