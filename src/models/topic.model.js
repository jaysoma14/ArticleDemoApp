const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        updateable: false
    }
}, {
    timestamps: true,
});

const Topic = mongoose.model('topic', topicSchema);

module.exports = Topic;