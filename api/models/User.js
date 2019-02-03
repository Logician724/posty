const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('User', userSchema);
