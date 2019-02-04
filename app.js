require('dotenv').config();
const config = require('./api/config/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
// eslint-disable-next-line no-unused-vars

const logger = require('logger').createLogger();
logger.setLevel(config.LOG_LEVEL);
require('./api/config/DBConnection')(logger);

const app = express();
const router = require('./api/routes/index');
const publicDir = path.join(__dirname, '/public/');
app.use(express.static(publicDir));


// -------------------- Middleware Stack ---------------- //
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);
// -------------------- END OF Middleware Stack ---------//

// Fallback all undefined endpoints to the home page
app.get('/*', (_req, res) => res.sendFile('index.html', { root: publicDir }));
// 500 internal server error handler
// eslint-disable-next-line max-params
app.use((err, _req, res, next) => {
    if (err.statusCode === 404) {
        return next();
    }

    return res.status(500).json({
        data: null,
        err: config.ENV === 'production'
            ? null
            : err,
        msg: '500 Internal Server Error'
    });
});

// 404 error handler
app.use((_req, res) => {
    res.status(404).json({
        data: null,
        err: null,
        msg: '404 Not Found'
    });
});

app.listen(config.PORT, () => {
    logger.debug('Server running on port:', config.PORT);
});

module.exports = app;
