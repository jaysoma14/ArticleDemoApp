const mongoose = require('mongoose');
const ArticleModel = require('./article.model');
const UserModel = require('./user.model');

const articleCommentSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: [true, "`description` is required"],
    },
    articleId: {
        type: mongoose.Schema.ObjectId,
        ref: 'article',
        required: [true, "`articleId` is required"],
        updateable: false,
        async validate(value) {
            const article = await ArticleModel.findById(value);
            if(!article) {
                throw new Error('article not found!');
            }
        }
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, "`userId` is required"],
        updateable: false,
        async validate(value) {
            const user = await UserModel.findById(value);
            if(!user) {
                throw new Error('user not found!');
            }
        }
    }
}, {
    timestamps: true
});

const ArticleComment = mongoose.model('article_comment', articleCommentSchema);

module.exports = ArticleComment;