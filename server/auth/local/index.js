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
		// console.log(req.body);
		/*if (!req.body.captcha) {
			error_msg = '验证码不能为空。';
		} else if (req.session.captcha !== req.body.captcha.toUpperCase()) {
			error_msg = '验证码错误。';
		} else if (req.body.username === '' || req.body.password === ''){
			error_msg = '用户名和密码不能为空。';
		}*/

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

		//console.log(user);

		if (err) {
			return res.status(401).send();
		}
		//console.log(info)
		if (info) {
			return res.status(403).send(info);
		}

		var token = auth.signToken(user._id);
		// admin-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODVkMjM2N2QzZDU1MzBjYTA4OWNmYjgiLCJpYXQiOjE0ODI3MzA1ODYsImV4cCI6MTUxNDI4ODE4Nn0.4vWPklrWF1Cnan3EQ5e06TgDOg2nQRXStvwbdLRWtvc
		return res.json({token: token});
	})(req, res, next);
});

module.exports = router;