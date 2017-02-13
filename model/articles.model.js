/**
 * 文章表
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title:{  // 标题
        type:String
        /*,
        unique: true*/
    },
    content:String,  // 文章内容
    //一篇文章可以有多个标签
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    platform: String,
    cover: String,  // 封面图
    preview: String,  // 预览图
    case_url: String,  // 案例地址
    visit_count:{  //访问数
        type: Number,
        default: 1
    },
    created: {  // 创建时间
        type: Date,
        default: Date.now
    },
    publish_time: {  // 发布时间
        type: Date,
        default: Date.now
    },
    updated: {  // 更新时间
        type: Date,
        default: Date.now
    }
});

ArticleSchema
    .virtual('info')
    .get(function() {
        return {
            '_id': this._id,
            'platform': this.platform,
            'title': this.title,
            'content': this.content,
            'cover': this.cover,
            'preview':this.preview,
            'visit_count': this.visit_count,
            'case_url':this.case_url,
            'publish_time': this.publish_time,
            'tags': this.tags
        };
    });


var Article = mongoose.model('Article', ArticleSchema);

var Promise = require('bluebird');
Promise.promisifyAll(Article);
Promise.promisifyAll(Article.prototype);

module.exports = Article;