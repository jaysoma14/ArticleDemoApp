const { UNAUTHORIZED } = require("../constants/httpCode.const");

class UnauthorizedError extends Error {
    constructor(message) {
        super(message || "Unauthorized Access");
        this.status = UNAUTHORIZED
    }
}

module.exports = UnauthorizedError;