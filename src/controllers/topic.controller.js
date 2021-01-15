const { TopicModel } = require('../models');

const crud = require('./crud')(TopicModel);

module.exports = {
    ...crud
}