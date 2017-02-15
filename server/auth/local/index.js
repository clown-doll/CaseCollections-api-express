'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var router = express.Router();
var User = mongoose.model('User');

router.post('/', function(req, res, next){
	// 测试环境不验证
	if (process.env.NODE_ENV !== 'test') {
		var error_msg;

		if (req.body.username === '' || req.body.password === ''){
            error_msg = '用户名和密码不能为空。';
        }

		if (error_msg) {
			return res.status(400).send({error_msg: error_msg});
        } else {
            next();
        }

	} else {
		next();
	}
}, function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if (err) {
			return res.status(401).send();
		}

        if (! user) {
            return res.send({success: false, message: '用户不存在或没有权限'});
        }

		if (info) {
			return res.status(403).send(info);
		}

		var token = auth.signToken(user._id);
		return res.json({success: true, token: token});
	})(req, res, next);
});

module.exports = router;