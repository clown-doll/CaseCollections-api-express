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
    var category = req.params.category.toLocaleLowerCase();

    Tag.findAsync({platform: platform, category: category}).then(function (result) {
        return res.status(200).json({data: result});
    }).catch(function (err) {
        return next(err);
    });
};

// 获取单个标签
exports.getFrontTag = function (req, res, next) {
    var id = req.params.id;

    return Tag.findByIdAsync(id).then(function(result) {
        return res.status(200).json({data:result});
    }).catch(function (err) {
        return next(err);
    });
};


/*
 * 文章相关所有方法
 * */

// 获取博客列表
exports.getFrontArticleList = function (req, res, next) {
    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
    var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
    var startRow = (currentPage - 1) * itemsPerPage;

    var conditions = {};

    if (req.query.tags) {
        if (req.query.tags.length === 1) {
            conditions.tags = {$in: req.query.tags}
        } else {
            conditions.tags = {$all: req.query.tags}
        }
    }

    if (req.query.platform) {
        conditions.platform = req.query.platform;
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
        .populate('tags')
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
