const BadRequestError = require('./bad-request.error');
const PageNotFoundError = require('./page-not-found.error');
const UnauthorizedError = require('./unauthorized.error')
const ForbiddenError = require('./forbidden.error')

const Error = {
    BadRequestError,
    PageNotFoundError,
    UnauthorizedError,
    ForbiddenError,
}

module.exports = Error;