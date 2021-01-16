const { TopicModel, getNotGeneratedFields } = require('../models');

exports.create = async (req, res, next) => {
    try {
        const fields = getNotGeneratedFields(TopicModel);

        const topic = new TopicModel();

        fields.forEach(field => {
            topic[field] = req.body[field];
        })

        const response = await topic.save();
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const topics = await TopicModel.find();
        res.json(topics);
    } catch (error) {
        next(error);
    }
}
