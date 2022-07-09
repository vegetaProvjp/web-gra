const mongoose = require('mongoose');

// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    name: { type: String },
    // description: { type: String },
    image: [],
    // slug: { type: String, slug: "title", unique: true },
    // price: {type: String, require: true},
    // title: {type: String, require: true},
    // quantity: {type: String, require: true},
    // category: {type: String, require: true},
    // isAvailable: {type: Boolean, require: true},
    // isDeleted: {type: Boolean, require: true},
    // shippingFee: {type: String, require: true},
}, {
    // timestamps : true,
    collection: 'product'
});

module.exports = mongoose.model('product', productSchema);
//module.exports = mongoose.model('Product', Product, 'product');
//