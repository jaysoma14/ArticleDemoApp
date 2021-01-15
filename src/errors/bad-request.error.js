const { BAD_REQUEST } = require("../constants/httpCode.const");

class BadRequestError extends Error {
    constructor(message) {
        super(message || "Bad Request Error");
        this.status = BAD_REQUEST;
    }
}

module.exports = BadRequestError;