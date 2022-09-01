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
  quantity: Number,
  sale: Number,
  description: { type: String },
  //thể loại
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  deleteAt: { type: Date, default: Date.now },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
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
// const products =mongoose.model('products', userSchema);
// var accountAll = async function (req, res) {
//   var account = await products.updateMany({},
//     { $set: {"sale": 0} },
//     {upsert: true})
// }