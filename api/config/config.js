/* eslint-disable max-len */

module.exports = {
    ENV: process.env.environment || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    MONGO_URI: process.env.DATABASE_URL || 'mongodb://localhost:27017/posty',
    PORT: process.env.PORT || 4500,
    SECRET: process.env.SECRET || ';iN.yVt,Tmu44cZkX#.|tS>s`4xb;-oRe66iMz0[L^e9;ltF_5"DUvPphj:f:&'
};
