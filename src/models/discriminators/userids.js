const mongoose = require('mongoose');

const userIdsSchema = new mongoose.Schema({
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
        updateable: false
    },
    modifiedBy: {
        type:mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

module.exports = userIdsSchema;