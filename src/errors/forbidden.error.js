const { FORBIDDEN } = require("../constants/httpCode.const");

class ForbiddenError extends Error {
    constructor(message) {
        super(message || "Request Forbidden");
        this.status = FORBIDDEN
    }
}

module.exports = ForbiddenError;