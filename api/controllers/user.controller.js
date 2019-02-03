const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');


module.exports.signup = (req, res, next) => {


    const newUser = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        username: req.body.username
    };

    return User.findOne({
        $or:
            [
                { email: newUser.email },
                { username: newUser.username }
            ]
    }, (findErr, existingUser) => {
        if (findErr) {
            return next(findErr);
        }
        if (existingUser) {
            return res.status(422).send({
                data: null,
                err: null,
                msg: 'This username or email have already been registered'
            });
        }

        return User.create(newUser, (createErr, user) => {
            if (createErr) {
                return next(createErr);
            }
            const token = jwt.sign(
                { id: user._id },
                config.SECRET,
                { expiresIn: 604800 }
            );

            return res.status(200).send({
                data: {
                    token,
                    user
                },
                err: null,
                msg: 'User has been successfully signed up'
            });
        });
    });
};

module.exports.login = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }, (findErr, existingUser) => {
        if (findErr) {
            return next(findErr);
        }
        if (!existingUser) {
            return res.status(401).send({
                data: null,
                err: null,
                msg: 'No user exists with this username'
            });
        }

        return bcrypt.compare(
            req.body.password,
            existingUser.password,
            (compareErr, result) => {
                if (compareErr) {
                    return next(compareErr);
                }
                if (!result) {
                    return res.status(401).send({
                        data: null,
                        err: null,
                        msg: 'Incorrect password'
                    });
                }

                delete existingUser.password;
                const token = jwt.sign(
                    existingUser.toJSON(),
                    config.SECRET,
                    { expiresIn: 43200 }
                );

                return res.status(200).send({
                    data: {
                        existingUser,
                        token
                    },
                    err: null,
                    msg: 'Login Successful'
                });
            });
    });
};
