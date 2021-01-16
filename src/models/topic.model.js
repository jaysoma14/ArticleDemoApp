const mongoose = require('mongoose');
const UserModel = require('./user.model');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "`name` is required"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        updateable: false,
        async validate(value) {
            const user = await UserModel.findById(value);
            if(!user) {
                throw new Error('`user` not found!');
            }
        }
    }
}, {
    timestamps: true,
});

topicSchema.virtual("articles", {
    ref: 'article',
    localField: '_id',
    foreignField: 'topicId'
})

const Topic = mongoose.model('topic', topicSchema);

module.exports = Topic;