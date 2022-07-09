const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const categorySchema = Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
}, {
  collection: 'category'
});

//quan hệ
categorySchema.virtual('products',{
  ref : 'products',
  localField: '_id',
  foreignField: 'category'
})

// Set Object and Json property to true. Default is set to false
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Category", categorySchema);