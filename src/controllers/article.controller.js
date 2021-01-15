const { ArticleModel } = require('../models');

const crud = require('./crud')(ArticleModel);

module.exports = {
    ...crud
}