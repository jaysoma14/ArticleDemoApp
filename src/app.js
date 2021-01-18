const express = require('express');
const { PageNotFoundError } = require('./errors');

const app = express();
require('./db/mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require('./routes'));

// 404 page
app.all("*", (req, res, next) => {
    next(new PageNotFoundError());
})

// error handling
app.use(require('./middleware/mongooseToCustomError'));
app.use(require('./middleware/maintainLogs'));
app.use(require("./middleware/errorHandler"));

module.exports = app;