const { UserModel } = require('../models');
const { UnauthorizedError } = require('../errors')
const bcrypt = require('bcryptjs');

const crud = require('./crud')(UserModel);

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            throw new UnauthorizedError('Wrong username or password!');
        }
        
        const user = await UserModel.findOne({ email });

        const isMatch = await bcrypt.compare(password, user?.password || '');
        if (!user || !isMatch) {
            throw new UnauthorizedError('Wrong username or password!');
        }

        const accessToken = await user.generateToken();

        res.json({
            accessToken,
            user
        });

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
        await req.user.save();
        res.json();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    ...crud,
    login,
    logout
}