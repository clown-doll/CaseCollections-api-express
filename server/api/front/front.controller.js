'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var MarkdownIt = require('markdown-it');

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
    console.log(req.query.tags);

    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
    var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
    var startRow = (currentPage - 1) * itemsPerPage;

    var conditions = {};

    if (req.query.tags) {
        var tagsArr = req.query.tags.split(',');
        tagsArr = tagsArr.filter(function(e){return e});

        if (tagsArr.length) {
            if (tagsArr.length === 1) {
                conditions = {
                    'tags': {$in: tagsArr}
                };
            } else {
                conditions = {
                    'tags': {$all: tagsArr}
                };
            }

        }
    }

    var sort = req.query.sortName || "publish_time";
    sort = "-" + sort;

    var c;
    Article.count(conditions, function (err, count, next) {
        if (err) {
            return next(err);
        }
        c = count;
    });

    Article.find(conditions)
        .skip(startRow)
        .limit(itemsPerPage)
        .sort(sort)
        .exec()
        .then(function (ArticleList) {
            return res.status(200).json({ data: ArticleList, count: c});
        })
        .catch(function (err) {
            return next(err);
        });
};

// 获取单篇博客
exports.getFrontArticle = function (req, res, next) {
    var id = req.params.id;
    var md = new MarkdownIt({
        html: true //启用html标记转换
    });

    return Article.findByIdAsync(id).then(function(result) {
        //将content markdown文档转成HTML
        result.content = md.render(result.content);
        result.visit_count++;
        Article.findByIdAndUpdateAsync(id,{$inc:{visit_count:1}});
        return res.status(200).json({data:result.info});
    }).catch(function (err) {
        return next(err);
    });
};
