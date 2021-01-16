const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "`name` is required"],
        trim: true,
        maxlength: [50, '`name` is not greater than 20 characters'],
        validate(value) {
            if(!value.match(/^[a-z ]+$/i)) {
                throw new Error('`name` contains only alphabets');
            }
        }
    },
    email: {
        type: String,
        required: [true, "`email` is required"],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 255,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('`email` not valid');
            }
        }
    },
    password: {
        type: String,
        required: [true, "`password` is required"],
        trim: true,
        updateable: false
    },
    followUsers: [{
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: [true, "`userId` is required"],
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: [true, "`token` is required"]
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('articles', {
    ref: 'article',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.pre('save', function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, 8);
    }
    next();
})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.followUsers;

    return userObj;
}

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7 days" });
    
    user.tokens = [...user.tokens || [], { token }];
    await user.save();
    
    return token;
}

const User = mongoose.model('user', userSchema);

module.exports = User;