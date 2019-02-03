const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = mongoose.Schema({
    creator: {
        required: true,
        type: ObjectId
    },
    text: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Post', postSchema);
