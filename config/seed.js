/**
 * 初始化数据
 */

'use strict';

var mongoose = require('mongoose');
var	User = mongoose.model('User');
var	Tag = mongoose.model('Tag');
var Promise = require('bluebird');

if(process.env.NODE_ENV === 'development'){
    User.countAsync().then(function (count) {
        if(count === 0){
            User.removeAsync().then(function () {
                User.createAsync({
                    username:'admin',
                    role:'admin',
                    password:'admin'
                },{
                    username:'test001',
                    role:'user',
                    password:'test'
                },{
                    username:'test002',
                    role:'user',
                    password:'test'
                },{
                    username:'test003',
                    role:'user',
                    password:'test'
                });
            });
        }
    });
}