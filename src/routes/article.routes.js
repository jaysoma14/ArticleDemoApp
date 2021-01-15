const express = require('express');
const router = new express.Router();

const { ArticleController } = require('../controllers');
const { auth, owner } = require('../middleware/auth');

router.get("/", ArticleController.get);

router.post("/", auth, owner, ArticleController.create);
router.put("/:id", auth, owner, ArticleController.updateById);
router.delete("/:id", auth, owner, ArticleController.deleteById);


module.exports = router;