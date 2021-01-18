const { ValidationError } = require('mongoose').Error;
const { BadRequestError } = require('../errors');

const mongooseToCustomError = (err, req, res, next) => {
    if(err instanceof ValidationError) {
        const fields = Object.keys(err.errors);
        let message = "";
        fields.map(field => {
            message += err.errors[field].message + ", ";
        })
        const badRequestError = new BadRequestError(message);
        badRequestError.fields = fields;
        next(badRequestError);
    }
    // 11000 & 11001 for mongoerror
    else if(err?.code === 11000 || err?.code === 11001) {
        const keys = Object.keys(err.keyValue);
        next(new BadRequestError(`${keys[0]} with '${err.keyValue[keys[0]]}' already found!`))
    }
    // file size
    else if(err?.code === 'LIMIT_FILE_SIZE') {
        next(new BadRequestError('File size is greater than 1MB!'));
    }
    else next(err);
}

module.exports = mongooseToCustomError