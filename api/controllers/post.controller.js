const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports.addPost = (req, res, next) => {
    Post.create({
        creator: req.user._id,
        text: req.body.text
    }, (createErr, post) => {
        if (createErr) {
            return next(createErr);
        }

        return res.status(201).send({
            data: post,
            err: null,
            msg: 'Post created Successfully'
        });
    });
};

module.exports.getAllPosts = (req, res, next) => {
    Post.paginate({}, {
        limit: req.body.limit,
        offset: req.body.offset
    }, (err, result) => {
        if (err) {
            return next(err);
        }

        return res.send(result);
    });
};
