const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/project_graduation');
        console.log("Connected database");
    }
    catch (error) {
        console.log("Connect database error");
    }
}

module.exports = {connect}