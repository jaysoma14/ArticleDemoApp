const { SERVER_ERROR } = require("../constants/httpCode.const");

const maintainLogs = (err, req, res, next) => {
    const code = err.status || SERVER_ERROR;
    if (process.env.NODE_ENV === "development" && code === SERVER_ERROR) {
        console.log(err);
    }
    next(err);
}
module.exports = maintainLogs;