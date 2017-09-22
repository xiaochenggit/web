let mongoose = require('mongoose')
let Schema = mongoose.Schema;
let userSchema = new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": {
        type: String,
        default: ''
    },
    "phone": {
        type: String,
        default: ''
    },
    "role": {
        type: Number,
        default: 0
    },
    "loadTime": {
        type: Number,
        default: new Date().getTime()
    },
    "createTime": {
        type: Number,
        default: new Date().getTime()
    }
});

module.exports = mongoose.model('User', userSchema);