const { SERVER_ERROR } = require("../constants/httpCode.const");
const fs = require('fs');
const path = require('path');

const maintainLogs = (err, req, res, next) => {
    const code = err.status || SERVER_ERROR;
    if (code === SERVER_ERROR) {
        if (process.env.NODE_ENV === "development") {
            console.log(err);
        }
        else {
            fs.writeFile(path.join(__dirname, "../../logs") + "/" + Date.now() + ".txt", err.stack, ()=>{});
        }
    }
    next(err);
}
module.exports = maintainLogs;