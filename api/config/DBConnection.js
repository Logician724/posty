/* eslint-disable global-require */
const mongoose = require('mongoose');
const config = require('./config');
module.exports = (logger) => {
    mongoose.connect(config.MONGO_URI).
        then(() => {
            logger.debug('successfully connected to database on the url: ' +
                config.MONGO_URI);
        }).
        catch((err) => {
            if (err) {
                logger.fatal(err);
            }
        });
    // Init models
    require('../models/User');
    require('../models/Post');
};

