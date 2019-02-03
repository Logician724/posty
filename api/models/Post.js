const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema);
