'use strict';

var path = require('path');
var _ = require('lodash');

var all = {
  env: process.env.NODE_ENV,  // 环境
  root: path.normalize(__dirname + '/../../..'),  // 规范化路径
  port: process.env.PORT || 9000,  // 端口
  mongo: {
      // 数据库设置
      options: {
          user: process.env.MONGO_USERNAME || '',
          pass: process.env.MONGO_PASSWORD || ''
      }
  },
  session: {
      secrets: 'case-collections-secret'
  },
  //是否初始化数据
  seedDB: false,
  //用户角色种类
  userRoles: ['user', 'admin']
}

// 递归地合并配置文件
var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});

module.exports = config;