const express = require('express');
const router = new express.Router();

const { UserController } = require('../controllers');
const { auth } = require('../middleware/auth');

router.post("/", UserController.create);
router.post("/login", UserController.login);
router.post("/logout", auth, UserController.logout);

module.exports = router;