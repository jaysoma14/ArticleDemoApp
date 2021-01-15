const { SERVER_ERROR } = require('../constants/httpCode.const')

const errorHandler = (err, req, res, next) => {
    const code = err.status || SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    res.status(code).json({
        error: message
    })
}

module.exports = errorHandler