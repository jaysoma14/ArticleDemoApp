const { ArticleModel, TopicModel, getNotGeneratedFields, getUpdateableFields, UserModel } = require('../models');
const { PageNotFoundError } = require('../errors')
const { isMongoId } = require('validator')
const { validateImageFile, uploadFile, removeFile } = require('../helphers/file-handling');
const container = "articles";

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @param {String} req.params.sortBy - field name for sorting
 * @param {Boolean} req.params.desc - descending order  
 */
exports.getAll = async (req, res, next) => {
    try {
        const sort = {}

        const sortBy = req.query.sortBy || 'publishedTime';
        const desc = req.query.desc === 'false' ? 1 : -1;
        sort[sortBy] = desc;

        const result = await ArticleModel.find({}, [], {
            sort
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isMongoId(id)) {
            throw new PageNotFoundError(`article not found!`);
        }
        const article = await ArticleModel.findById(id);
        if (!article) {
            throw new PageNotFoundError(`article not found!`);
        }
        res.json(article);
    } catch (error) {
        next(error);
    }
}

exports.create = async (req, res, next) => {
    await validateImageFile("image")(req, res, async (err) => {
        try {
            if (err) throw err;

            const fields = getNotGeneratedFields(ArticleModel);

            const article = new ArticleModel();

            fields.forEach(field => {
                article[field] = req.body[field];
            })
            article.imagePath = req.file && `/${container}/${req.file.filename}`;
            article.publishedTime = Date.now();
            article.userId = req.user._id;

            const response = await article.save();

            req.file && await uploadFile(container, req.file.filename, req.file.buffer);

            res.json(response);
        }
        catch (error) {
            next(error);
        }
    });
}

exports.updateById = async (req, res, next) => {

    const { id } = req.params;
    if (!isMongoId(id)) {
        next(new PageNotFoundError(`article not found!`));
    }

    const article = await ArticleModel.findOne({ _id: id, userId: req.user._id });
    if (!article) {
        next(new PageNotFoundError(`article not found!`));
    }

    await validateImageFile("image")(req, res, async (err) => {
        try {
            if (err) throw err;

            const fields = getUpdateableFields(ArticleModel);

            fields.forEach(field => {
                article[field] = req.body[field] || article[field];
            })

            if (req.file) {
                article.imagePath && await removeFile(article.imagePath);
                article.imagePath = `/${container}/${req.file.filename}`;
            }

            await article.save();
            req.file && await uploadFile(container, req.file.filename, req.file.buffer);

            res.json(article);
        } catch (error) {
            next(error);
        }
    })
}

exports.deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isMongoId(id)) {
            throw new PageNotFoundError(`article not found!`);
        }

        const article = await ArticleModel.findOne({ _id: id, userId: req.user._id });
        if (!article) {
            throw new PageNotFoundError(`article not found!`);
        }

        await article.remove();
        article.imagePath && await removeFile(article.imagePath);

        res.json(article);
        
    } catch (error) {
        next(error);
    }
}

exports.getAllByTopicId = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isMongoId(id)) {
            throw new PageNotFoundError(`topic not found!`);
        }

        const topic = await TopicModel.findById(id);
        if (!topic) {
            throw new PageNotFoundError(`topic not found!`);
        }

        await topic.populate('articles').execPopulate();
        res.json(topic.articles);
    } catch (error) {
        next(error);
    }
}

exports.getAllOfFollowUsers = async (req, res, next) => {
    try {
        const sort = {}

        const sortBy = req.query.sortBy || 'publishedTime';
        const desc = req.query.desc === 'false' ? 1 : -1;
        sort[sortBy] = desc;

        const followUser = req.user.followUsers.map((user) => { return { userId: user.userId } });
        let articles = [];

        if (followUser.length > 0) {
            articles = await ArticleModel.find({
                $or: followUser
            }, [], {
                sort
            })
            for (let i = 0; i < articles.length; i++) {
                await articles[i].populate('userId').execPopulate();
                await articles[i].populate('topicId').execPopulate();
            };
        }
        res.json(articles);
    } catch (error) {
        next(error);
    }
}