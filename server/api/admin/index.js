'use strict';

var express = require('express');
var controller = require('./admin.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

/*
* 用户
* */
router.get('/user/me', auth.hasRole('admin'), controller.getUserInfo);


/*
* 标签
* */
router.get('/tags/:platform/:category', auth.hasRole('admin'), controller.getTagList);  // 获取标签列表
router.post('/tags', auth.hasRole('admin'), controller.addTag);  // 添加标签
router.delete('/tags/:id', auth.hasRole('admin'), controller.deleteTag);  // 删除标签
router.put('/tags/:id', auth.hasRole('admin'), controller.updateTag);  // 修改标签


/*
* 文章
* */
router.get('/articles', auth.hasRole('admin'), controller.getArticleList);  // 获取文章列表
router.post('/articles', auth.hasRole('admin'), controller.addArticle);  // 创建文章
router.get('/articles/:id', auth.hasRole('admin'), controller.getArticle);  // 获取单篇博客
router.put('/articles/:id', auth.hasRole('admin'), controller.updateArticle);  // 更新博客
router.delete('/articles/:id', auth.hasRole('admin'), controller.destroy);  // 删除博客


/*
* 上传
*/
router.post('/upload', auth.hasRole('admin'), controller.Upload);  // 上传图片


module.exports = router;


