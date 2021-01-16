const mongoose = require('mongoose');
const TopicModel = require('./topic.model');
const UserModel = require('./user.model');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "`title` is required"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "`content` is required"]
    },
    publishedTime: {
        type: Date,
        required: [true, "`publishedTime` is required"],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, "`userId` is required"],
        async validate(value) {
            const user = await UserModel.findById(value);
            if (!user) {
                throw new Error('user not found!');
            }
        }
    },
    topicId: {
        type: mongoose.Schema.ObjectId,
        ref: 'topic',
        required: [true, "`topicId` is required"],
        async validate(value) {
            const topic = await TopicModel.findById(value);
            if (!topic) {
                throw new Error('topic not found!');
            }
        }
    }
}, {
    timestamps: true
})

const Article = mongoose.model('article', articleSchema);

module.exports = Article;