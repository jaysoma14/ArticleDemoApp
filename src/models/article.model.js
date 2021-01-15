const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    publishedTime: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    topicId: {
        type: mongoose.Schema.ObjectId,
        ref: 'topic',
        required: true
    }
}, {
    timestamps: true
})

const Article = mongoose.model('article', articleSchema);

module.exports = Article;