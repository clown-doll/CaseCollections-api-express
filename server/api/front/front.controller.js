'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Tag = mongoose.model('Tag');
var Article = mongoose.model('Article');


/*
* 标签相关所有方法
* */

// 获取标签列表
exports.getFrontTagList = function (req, res, next) {
    var platform = req.params.platform.toLocaleLowerCase();

    Tag.findAsync({platform: platform}).then(function (result) {
        return res.status(200).json({data: result});
    }).catch(function (err) {
        return next(err);
    });
};


/*
 * 文章相关所有方法
 * */

// 获取博客列表
exports.getFrontArticleList = function (req, res, next) {
    //console.log(req.query.tags);
    var conditions = {};

    if (req.query.tags) {
        conditions = {
            tags: req.query.tags
        };
    }

    Article.find(conditions)
        .sort({publish_time: -1})
        .exec()
        .then(function (ArticleList) {
            return Article.countAsync().then(function (count) {
                return res.status(200).json({ data: ArticleList, count:count });
            });
        })
        .catch(function (err) {
            return next(err);
        });
};

