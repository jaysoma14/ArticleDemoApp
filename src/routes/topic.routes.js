const express = require('express');
const router = new express.Router();

const { TopicController } = require('../controllers');
const { auth, owner } = require('../middleware/auth');

router.get("/", TopicController.get);
router.post("/", auth, owner, TopicController.create);

module.exports = router;