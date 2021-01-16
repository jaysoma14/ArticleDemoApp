const { UserModel, getNotGeneratedFields } = require('../models');
const { UnauthorizedError, PageNotFoundError } = require('../errors')
const bcrypt = require('bcryptjs');
const { isMongoId } = require('validator')

exports.create = async (req, res, next) => {
    try {
        const fields = getNotGeneratedFields(UserModel);

        const user = new UserModel();

        fields.forEach(field => {
            user[field] = req.body[field];
        })

        const response = await user.save();
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
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

exports.logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
        await req.user.save();
        res.json();
    } catch (error) {
        next(error);
    }
}

exports.followUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isMongoId(id) || id === req.user._id.toString()) {
            throw new PageNotFoundError('user not found!');
        }

        const user = await UserModel.findById(id);
        if (!user) {
            throw new PageNotFoundError('user not found!');
        }

        const followUsersIndex = req.user.followUsers.findIndex((a) => a.userId.toString() === id.toString());
        if (followUsersIndex <= -1) {
            req.user.followUsers.push({ userId: id });
        }
        else {
            req.user.followUsers.splice(followUsersIndex, 1);
        }
        await req.user.save();
        res.json();
    } catch (error) {
        next(error);
    }
}

exports.getArticles = async (req, res, next) => {
    try {
        const userId = (req.params.userId || req.user._id).toString();
        if (!isMongoId(userId)) {
            throw new PageNotFoundError(`user not found!`);
        }

        const user = req.user || await UserModel.findById(userId);
        await user.populate('articles').execPopulate();

        res.json(user.articles);
    } catch (error) {
        next(error)
    }
}