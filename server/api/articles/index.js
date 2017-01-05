'use strict';

var express = require('express');
var controller = require('./articles.controller');
var auth = require('../../auth/auth.service');

//var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });

var router = express.Router();

//后台
router.post('/', auth.hasRole('admin'), controller.addArticle);  // 创建文章
router.get('/', auth.hasRole('admin'), controller.getArticleList);  // 获取文章列表
router.put('/:id', auth.hasRole('admin'), controller.updateArticle);  // 更新博客
router.delete('/:id', auth.hasRole('admin'), controller.destroy);  // 删除博客
router.get('/:id', auth.hasRole('admin'), controller.getArticle);  // 获取单篇博客

// 前台
router.get('/front/:id', controller.getFrontArticle);  // 获取单篇博客
router.get('/front/tags/:id', controller.getFrontArticleList);  // 获取博客列表

module.exports = router;