var mongoose = require("mongoose")
var Schema = mongoose.Schema

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    cart: { type: Object, required: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    isDelivered: { type: Boolean, default: false, required: true },
}, {
    timestamps: true,
    collection: order,
}
);
const Order = mongoose.model('order', OrderSchema);
module.exports = Order