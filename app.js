'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';  // 设置默认环境变量
var express = require('express');
var logger = require('morgan');  // http请求的日志中间件
var mongoose = require('mongoose');  // mongoose 数据库
var config = require('./config/env');  // 配置文件
var errorHandler = require('errorhandler');  // 仅限开发的错误处理程序中间件
var path = require('path');
var fs = require('fs');


// 链接数据库
mongoose.connect(config.mongo.uri, config.mongo.options);
var modelsPath = path.join(__dirname, 'model');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

//mongoose promise 风格
mongoose.Promise = global.Promise;

// 初始化数据
if(config.seedDB) { require('./config/seed'); }

var app = express();

// 日志
app.use(logger('dev'));

// http请求中间件
require('./config/express')(app);
// 路由
require('./routes')(app);

// 错误处理
if (config.env === 'development') {
    app.use(errorHandler());
} else {
    app.use(function (err, req, res, next) {
        return res.status(500).send();
    });
}

// Start server
app.listen(config.port, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

module.exports = app;