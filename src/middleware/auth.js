const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');
const { UserModel } = require('../models')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", "");
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findOne({ _id: decode._id, 'tokens.token': token });
        if (!user) {
            throw new UnauthorizedError();
        }
        req.token = token;
        req.user = user;
        req.body.createdBy = user._id;
        next();
    }
    catch (error) {
        next(new UnauthorizedError());
    }
}

const owner = async (req, res, next) => {
    req.owner = true;
    next();
}

module.exports = { auth, owner };