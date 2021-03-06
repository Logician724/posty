const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const postSchema = mongoose.Schema({
    createdAt: {
        default: Date.now,
        type: Date
    },
    creator: {
        required: true,
        type: String
    },
    text: {
        required: true,
        type: String
    }
});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema);
