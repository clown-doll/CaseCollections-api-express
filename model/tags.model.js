/**
 * 标签表
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    publish_time: {  // 发布时间
        type: Date,
        default: Date.now
    },
    name:{						//标签名称
        type: String
        //unique: true
    },
    platform: String,
    category: String
});
/*
TagSchema
    .virtual('info')
    .get(function() {
        return {
            '_id': this._id,
            'name': this.title
        };
    });*/

var Tag = mongoose.model('Tag', TagSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Tag);
Promise.promisifyAll(Tag.prototype);

module.exports = Tag;