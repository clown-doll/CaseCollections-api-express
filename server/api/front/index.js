'use strict';

var express = require('express');
var controller = require('./front.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

/*
* 标签
* */
router.get('/tags/:platform', controller.getFrontTagList);  // 获取前台标签


/*
* 文章
* */
router.get('/articles', controller.getFrontArticleList);  // 获取文章列表



module.exports = router;



