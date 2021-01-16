const express = require('express');
const router = new express.Router();

const { UserController } = require('../controllers');
const { auth } = require('../middleware/auth');

router.post("/", UserController.create);
router.post("/login", UserController.login);
router.post("/logout", auth, UserController.logout);
router.get("/articles", auth, UserController.getArticles);

router.patch("/follow/:id", auth, UserController.followUser);
router.get("/:userId/articles", UserController.getArticles);

module.exports = router;