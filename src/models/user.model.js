const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        validate(value) {
            if(!value.match(/^[a-z ]+$/i)) {
                throw new Error('contains only alphabets');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 255,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    followUsers: [{
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

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