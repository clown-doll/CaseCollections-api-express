'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// 后台获取所有用户列表
router.get('/', auth.hasRole('admin'), controller.getUserList);



// 获取用户信息
router.get('/me', auth.isAuthenticated(), controller.getMe);

module.exports = router;