const express = require('express');
const router = express.Router();

const UserRoutes = require('./user.routes');
const TopicRoutes = require('./topic.routes');
const ArticleRoutes = require('./article.routes');

router.use('/users', UserRoutes);
router.use('/topics', TopicRoutes);
router.use('/articles', ArticleRoutes);

module.exports = router;