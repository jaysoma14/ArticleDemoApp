const express = require('express');
const router = new express.Router();

const { TopicController } = require('../controllers');
const { auth } = require('../middleware/auth');

router.get("/", TopicController.getAll);
router.post("/", auth, TopicController.create);

module.exports = router;