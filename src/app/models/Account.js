const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator')
var bcrypt = require('bcrypt')
mongoose.plugin(slug)
const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    email: {type: String, unique: true},
    password: {type: String},
    fullName: {type: String},
    phone: {type: String},
    address: {type: String},
    province: {type: String, required: true},
    district: {type: String, required: true},
    ward: {type: String, required: true},
    gender: {type: Boolean},
    role: {type: String, default: 'user'},
    deleteAt: { type: Date, default: Date.now},
    createAt: { type: Date, default: Date.now},
    updateAt: { type: Date, default: Date.now},
}, {
    timestamps: true,
    collection: 'account'
})
AccountSchema.statics.login = async function(email, password){
    const account = await this.findOne({email});
    if(account){
        const auth = await bcrypt.compare(password, account.password);
        if(auth){
            return account;
        }
        throw Error("incorrect passwrord");
    };
    throw Error("incorrect username");
}

//quan hệ với product: id cua Account de khớp với biến user khi tạo product
// AccountSchema.virtual('products',{
//     ref : 'products',
//     localField: '_id',
//     foreignField: 'account'
// })

AccountSchema.set('toObject', { virtuals: true });
AccountSchema.set('toJSON', { virtuals: true });
const Account =mongoose.model('account', AccountSchema);

module.exports = Account;