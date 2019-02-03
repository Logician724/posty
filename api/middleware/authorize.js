
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const config = require('../config/config');

module.exports = (req, res, next) => {

    if (req.hasOwnProperty('headers') &&
        req.headers.hasOwnProperty('authorization')) {
        try {
            const payload = jwt.verify(
                // eslint-disable-next-line dot-notation
                req.headers['authorization'],
                config.SECRET
            );

            return User.find({ _id: payload.id }, (err, user) => {

                if (err) {
                    return next(err);
                }

                if (!user) {

                    return res.status(401).json({
                        data: null,
                        err: null,
                        msg: 'Unauthorized user!'
                    });
                }
                req.user = user;

                return next();
            });
        } catch (err) {
            return res.status(401).json({
                data: null,
                err: process.env.NODE_ENV === 'production'
                    ? null
                    : err,
                msg: 'Failed to authenticate token!'
            });
        }
    } else {
        return res.status(401).json({
            data: null,
            err: null,
            msg: 'No token!'
        });
    }

    return next();
};
