const express = require('express');
const router = express.Router();

const UserRoutes = require('./user.routes');
const TopicRoutes = require('./topic.routes');
const ArticleRoutes = require('./article.routes');
const FileStorageController = require('../controllers/file-storage.controller')

router.use('/users', UserRoutes);
router.use('/topics', TopicRoutes);
router.use('/articles', ArticleRoutes);
router.use('/file/:container/:fileName', FileStorageController.getFile);

module.exports = router;