const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports.addPost = (req, res, next) => {
    Post.create({
        creator: req.user.username,
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
        limit: parseInt(req.params.limit, 10),
        offset: parseInt(req.params.offset, 10),
        sort: { createdAt: -1 }
    }, (err, result) => {
        if (err) {
            return next(err);
        }

        return res.send(result);
    });
};
