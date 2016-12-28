'use strict';

var express = require('express');
var compression = require('compression');  // Node.js压缩中间件，支持deflate,gzip   https://www.npmjs.com/package/compression
var bodyParser = require('body-parser');  // 在处理程序之前在中间件中解析传入的请求正文，可以在req.body属性下获取。  https://www.npmjs.com/package/body-parser
var cors = require('cors');  // https://www.npmjs.com/package/cors
var methodOverride = require('method-override');  // 允许您在客户端不支持的地方使用HTTP动词，例如PUT或DELETE。   https://www.npmjs.com/package/method-override
var cookieParser = require('cookie-parser');  // cookie解析签名   https://www.npmjs.com/package/cookie-parser
var path = require('path');
var passport = require('passport');
var session = require('express-session');  // https://www.npmjs.com/package/express-session

var config = require('./env');

module.exports = function(app) {
    app.enable('trust proxy');
    var options = {  // ??
        origin: true,
        credentials: true
    };
    app.use(cors(options));
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());
};