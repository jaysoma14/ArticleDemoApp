const mongoose = require('mongoose');

const articleCommentSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    articleId: {
        type: mongoose.Schema.ObjectId,
        ref: 'article',
        required: true,
    }
}, {
    timestamps: true
});

const ArticleComment = mongoose.model('article_comment', articleCommentSchema);

module.exports = ArticleComment;