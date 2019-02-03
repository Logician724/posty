const { validationResult } = require('express-validator/check');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            data: null,
            errors: errors.mapped({ onlyFirstError: true }),
            msg: 'Validation errors found'
        });
    }

    return next();
};

module.exports = validate;
