'use strict';

var express = require('express');
var controller = require('./front.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

/*
* 标签
* */
router.get('/tags/:platform/:category', controller.getFrontTagList);  // 获取前台标签列表
router.get('/tags/:id', controller.getFrontTag);  // 获取前台单个标签


/*
* 文章
* */
router.get('/articles', controller.getFrontArticleList);  // 获取文章列表
router.get('/articles/:id', controller.getFrontArticle);  // 获取单篇文章


module.exports = router;



