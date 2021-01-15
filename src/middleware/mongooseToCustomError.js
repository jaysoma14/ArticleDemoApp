const { ValidationError } = require('mongoose').Error;
const { BadRequestError } = require('../errors');

const mongooseToCustomError = (err, req, res, next) => {
    if(err instanceof ValidationError) {
        next(new BadRequestError(err.message));
    }
    // 11000 & 11001 for mongoerror
    else if(err?.code === 11000 || err?.code === 11001) {
        next(new BadRequestError("Duplicate Record!"))
    }
    else next(err);
}

module.exports = mongooseToCustomError