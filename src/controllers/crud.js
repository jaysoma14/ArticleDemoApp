const { PageNotFoundError } = require('../errors');
const { getNotGeneratedFields, getUpdateableFields } = require('../models');
const { isMongoId } = require('validator')

module.exports = (model) => {
    const get = async (req, res, next) => {
        try {
            const where = req.owner ? { userId: req?.user?._id } : {}
            const result = await model.find(where);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    const getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isMongoId(id)) {
                throw new PageNotFoundError(`${model.modelName} not found!`);
            }
            const where = {
                _id: id
            }
            if (req.owner) where.userId = req?.user?._id;
            const result = await model.findOne(where);
            if (!result) {
                throw new PageNotFoundError(`${model.modelName} not found!`);
            }
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    const create = async (req, res, next) => {
        try {
            const fields = getNotGeneratedFields(model);

            const result = new model();

            fields.forEach(field => {
                result[field] = req.body[field];
            })

            if(req.owner && fields.includes('userId')) {
                result['userId'] = req.user._id
            }

            const response = await result.save();
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }

    const updateById = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isMongoId(id)) {
                throw new PageNotFoundError(`${model.modelName} not found!`);
            }

            const where = {
                _id: id
            }
            if (req.owner) where.userId = req?.user?._id;

            const result = await model.findOne(where);
            if (!result) {
                throw new PageNotFoundError(`${model.modelName} not found!`);
            }

            const fields = getUpdateableFields(model);

            fields.forEach(field => {
                result[field] = req.body[field] || result[field];
            })

            await result.save();

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    const deleteById = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!isMongoId(id)) {
                throw new PageNotFoundError(`${model.modelName} not found!`);
            }

            const where = {
                _id: id
            }
            if (req.owner) where.userId = req?.user?._id;
            
            const result = await model.findOne(where);
            if (!result) {
                throw new PageNotFoundError(`${model.modelName} not found!`);
            }

            await result.remove();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    return {
        get,
        getById,
        create,
        updateById,
        deleteById
    }
}