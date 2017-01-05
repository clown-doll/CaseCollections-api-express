'use strict';

var express = require('express');
var controller = require('./tags.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// 后台
// 获取标签列表
router.get('/:platform/:category', auth.hasRole('admin'), controller.getTagList);
// 添加标签
router.post('/', auth.hasRole('admin'), controller.addTag);
// 删除标签
router.delete('/:id', auth.hasRole('admin'), controller.deleteTag);
// 修改标签
router.put('/:id', auth.hasRole('admin'), controller.updateTag);

// 前台获取标签列表
router.get('/:platform', controller.getFrontTagList);

module.exports = router;