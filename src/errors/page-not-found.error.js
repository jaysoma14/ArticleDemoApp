const { PAGE_NOT_FOUND } = require("../constants/httpCode.const");

class PageNotFoundError extends Error {
    constructor(message) {
        super(message || "Page Not Found");
        this.status = PAGE_NOT_FOUND
    }
}

module.exports = PageNotFoundError;