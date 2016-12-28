/**
 * 用户表
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');  // https://nodejs.org/api/crypto.html#crypto_crypto

var UserSchema = new Schema({
    username: String,  // 用户名
    hashedPassword: String,  // 加密密码
    provider: {  // 用户登录方式: 目前只提供本地登录
        type:String,
        default:'local'
    },
    role: {  // 用户角色: adim, user
        type : String ,
        default : 'user'
    },
    salt: String, // 盐
    avatar:String  // 用户头像
});



/**
 * 虚拟属性，不写入数据库
 */

// 用户密码处理
UserSchema
    .virtual('password')
    .set(function(password) {
        //console.log(1111111);
        this._password = password;
        this.salt = this.makeSalt();
        //console.log('s: ' + this.salt);
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// 用户信息
UserSchema
    .virtual('userInfo')
    .get(function() {
        return {
            'username': this.username,  // 用户名
            'role': this.role,  // 用户权限
            'avatar': this.avatar,  // 用户头像
            'provider':this.provider  // 登陆方式
        };
    });

// 非敏感信息，放入token
UserSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role
        };
    });


/**
 * 方法
 */
UserSchema.methods = {
    //检查用户权限
    hasRole: function(role) {
        var selfRoles = this.role;
        return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1);
    },
    //生成盐
    makeSalt: function() {
        //console.log('makesalt: ' + crypto.randomBytes(16).toString('base64'));
        return crypto.randomBytes(16).toString('base64');
    },
    //生成密码
    encryptPassword: function(password) {
        //console.log('password: ' + password);
        //console.log('this.salt: ' + this.salt);
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        console.log(salt);
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
    },
    //验证用户密码
    authenticate: function(plainText) {
        console.log('1: ' + this.encryptPassword(plainText));
        console.log('2: ' + this.hashedPassword);
        return this.encryptPassword(plainText) === this.hashedPassword;
    }
};

//
UserSchema.set('toObject', {virtuals: true});

var User = mongoose.model('User', UserSchema);
var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;