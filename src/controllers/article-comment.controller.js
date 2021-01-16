const { ArticleCommentModel, getNotGeneratedFields, getUpdateableFields } = require('../models');
const { PageNotFoundError } = require('../errors')
const { isMongoId } = require('validator');

exports.getAll = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        if (!isMongoId(articleId)) {
            throw new PageNotFoundError(`topic not found!`);
        }

        const articleComments = await ArticleCommentModel.find({ articleId });
        for(let i=0;i<articleComments.length;i++) {
            await articleComments[i].populate('userId').execPopulate();
        }

        res.json(articleComments);

    } catch (error) {
        next(error);
    }
}

exports.create = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        if (!isMongoId(articleId)) {
            throw new PageNotFoundError(`article not found!`);
        }

        const fields = getNotGeneratedFields(ArticleCommentModel);

        const articleComment = new ArticleCommentModel();

        fields.forEach(field => {
            articleComment[field] = req.body[field];
        })
        articleComment.articleId = articleId;
        articleComment.userId = req.user._id;

        const response = await articleComment.save();
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}

exports.updateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isMongoId(id)) {
            throw new PageNotFoundError(`article comment not found!`);
        }

        const articleComment = await ArticleCommentModel.findOne({ _id: id, userId: req.user._id });
        if (!articleComment) {
            throw new PageNotFoundError(`article comment not found!`);
        }

        const fields = getUpdateableFields(ArticleCommentModel);

        fields.forEach(field => {
            articleComment[field] = req.body[field] || articleComment[field];
        })

        await articleComment.save();

        res.json(articleComment);
    } catch (error) {
        next(error);
    }
}

exports.deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isMongoId(id)) {
            throw new PageNotFoundError(`article comment not found!`);
        }

        const articleComment = await ArticleCommentModel.findOne({ _id: id, userId: req.user._id });
        if (!articleComment) {
            throw new PageNotFoundError(`article comment not found!`);
        }

        await articleComment.remove();
        res.json(articleComment);
    } catch (error) {
        next(error);
    }
}