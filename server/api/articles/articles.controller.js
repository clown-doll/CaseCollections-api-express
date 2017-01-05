'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var path = require('path');
var URL = require('url');
var MarkdownIt = require('markdown-it');  // 现代可插拔markdown解析器。 https://www.npmjs.com/package/markdown-it
var config = require('../../../config/env');
var Promise = require("bluebird");
//var tools = require('../../util/tools');
//var redis = require('../../util/redis');

//后台添加博客
exports.addArticle = function (req,res,next) {

    console.log(req.body);

    var content = req.body.content;
    var title = req.body.title;
    var caseUrl = req.body.case_url;
    var tags = req.body.tags;

    var error_msg;
    if (!title) {
        error_msg = '标题不能为空.';
    } else if (!content) {
        error_msg = '内容不能为空.';
    } else if (!caseUrl) {
        error_msg = '案例地址不能为空';
    } else if (!tags) {
        error_msg = '分类地址不能为空';
    }

    if (error_msg) {
        return res.status(422).send({error_msg: error_msg});
    }
    //将图片提取存入images,缩略图调用
    //req.body.images = tools.extractImage(content);
    return Article.createAsync(req.body).then(function (result) {
        return res.status(200).json({success: true, article_id: result._id});
    }).catch(function (err) {
        return next(err);
    });
};

//后台获取博客列表
exports.getArticleList = function (req,res,next) {
    // var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
    // var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
    // var startRow = (currentPage - 1) * itemsPerPage;
    //
    // var sortName = String(req.query.sortName) || "publish_time";
    // var sortOrder = req.query.sortOrder;
    // if(sortOrder === 'false'){
    //     sortName = "-" + sortName;
    // }

    var tags = req.query.tags;
    console.log(tags);

    Article.find({tags: tags})
        // .skip(startRow)
        // .limit(itemsPerPage)
        // .sort(sortName)
        .exec().then(function (ArticleList) {
        return Article.countAsync().then(function (count) {
            return res.status(200).json({ data: ArticleList, count:count });
        });
    }).then(null,function (err) {
        return next(err);
    });
};

// 后台博客更新
exports.updateArticle = function (req, res, next) {
    var id = req.params.id;

    if(req.body._id){
        delete req.body._id;
    }

    var content = req.body.content;
    var title = req.body.title;
    var caseUrl = req.body.case_url;
    var tags = req.body.tags;

    var error_msg;
    if (!title) {
        error_msg = '标题不能为空.';
    } else if (!content) {
        error_msg = '内容不能为空.';
    } else if (!caseUrl) {
        error_msg = '案例地址不能为空';
    } else if (!tags) {
        error_msg = '分类地址不能为空';
    }

    if (error_msg) {
        return res.status(422).send({error_msg: error_msg});
    }

    req.body.updated = new Date();
    /*if(req.body.isRePub){
        req.body.publish_time = new Date();
    }*/

    Article.findByIdAndUpdateAsync(id, req.body, {new:true}).then(function(article){
        return res.status(200).json({success:true,article_id:article._id});
    }).catch(function(err){
        return next(err);
    });
};

// 后台删除博客
exports.destroy = function (req,res,next) {
    var id = req.params.id;
    Article.findByIdAndRemoveAsync(id).then(function() {
        return res.status(200).send({success: true});
    }).catch(function (err) {
        return next(err);
    });
};

// 获取单篇博客
exports.getArticle = function (req,res) {
    var id = req.params.id;
    Article.findOne({_id: id})
        .populate('tags')
        .exec().then(function (article) {
        return res.status(200).json({data: article});
    }).then(null,function (err) {
        return res.status(500).send();
    });
};

//前台获取单篇文章
exports.getFrontArticle = function (req, res, next) {
    var id = req.params.id;
    var md = new MarkdownIt({
        html:true //启用html标记转换
    });
    //每次获取之后,将阅读数加1
    return Article.findByIdAsync(id).then(function(result) {
        //将content markdown文档转成HTML
        result.content = md.render(result.content);
        result.visit_count++;
        Article.findByIdAndUpdateAsync(id,{$inc:{visit_count: 1}});
        return res.status(200).json({data:result.info});
    }).catch(function (err) {
        return next(err);
    });
};

// 前台文章列表
exports.getFrontArticleList = function (req, res, next) {
    var tagId = req.params.id;

    Article.find({tags: tagId})
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