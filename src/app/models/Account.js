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
    gender: {type: Boolean},
    roles: {type: Number, default: 3},
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
const Account =mongoose.model('account', AccountSchema);

module.exports = Account;
