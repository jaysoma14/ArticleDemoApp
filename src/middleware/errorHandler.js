const { SERVER_ERROR } = require('../constants/httpCode.const')

const errorHandler = (err, req, res, next) => {
    const code = err.status || SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    const responseJson = {
        message
    }
    if(err.fields) responseJson.fields = err.fields;
    res.status(code).json(responseJson)
}

module.exports = errorHandler