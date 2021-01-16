const express = require('express');
const router = new express.Router();

const { ArticleController, ArticleCommentController } = require('../controllers');
const { auth } = require('../middleware/auth');

router.get("/", ArticleController.getAll);
router.get("/followUsers", auth, ArticleController.getAllOfFollowUsers);
router.get("/:id", ArticleController.getById);

router.post("/", auth, ArticleController.create);
router.put("/:id", auth, ArticleController.updateById);
router.delete("/:id", auth, ArticleController.deleteById);

router.get("/topic/:id", ArticleController.getAllByTopicId);


router.get("/:articleId/comments", ArticleCommentController.getAll);
router.post("/:articleId/comments", auth, ArticleCommentController.create);
router.put("/:articleId/comments/:id", auth, ArticleCommentController.updateById);
router.delete("/:articleId/comments/:id", auth, ArticleCommentController.deleteById);

module.exports = router;