'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Tag = mongoose.model('Tag');
var Article = mongoose.model('Article');


/*
 * 标签相关所有方法
 * */

// 获取标签列表
exports.getTagList = function (req, res, next) {
    //console.log(req.params);
    var platform = req.params.platform.toLocaleLowerCase();
    var category = req.params.category;
    var condition = {};

    if(platform && category){
        console.log(12);
        condition = {
            platform: platform,
            category: category
        };
    }

    console.log(condition);

    Tag.find(condition)
    //.sort('sort')
    //.populate('cid')
        .exec().then(function (tagList) {
        console.log(tagList);
        return res.status(200).json({data: tagList});
    }).then(null,function (err) {
        return next(err);
    });

};

// 添加标签
exports.addTag = function (req, res, next) {
    //标签名称不能重复,标签分类名称必须有.
    var error_msg;

    console.log(req.body);

    var tagName = req.body.name;
    var tagPlatForm = req.body.platform;
    var tagCategory = req.body.category;
    if (!tagName) {
        error_msg = '标签名称不能为空.';
    } else if (!tagCategory) {
        error_msg = '必须选择一个标签分类.';
    }

    if(error_msg){
        return res.status(422).send({error_msg: error_msg});
    }

    Tag.findOneAsync({name: tagName, platform: tagPlatForm, category: tagCategory}).then(function (tag) {

        if (tag) {
            console.log(tag);
            return res.status(403).send({error_msg: '标签名称已经存在.'});
        } else {
            //console.log(1);
            return Tag.createAsync(req.body).then(function (result) {
                console.log(result);
                return res.status(200).json({success: true, tag_id: result._id});
            });
        }
    }).catch(function (err) {
        return next(err);
    });
};

// 删除标签
exports.deleteTag = function (req, res, next) {
    var id = req.params.id;
    return Tag.findByIdAndRemoveAsync(id).then(function() {
        return res.status(200).json({success: true});
    }).catch(function (err) {
        return next(err);
    });
};

// 更新标签
exports.updateTag = function (req, res, next) {
    var id = req.params.id;
    if(req.body._id){
        delete req.body._id;
    }
    Tag.findByIdAndUpdateAsync(id, req.body, {new: true}).then(function(result){
        return res.status(200).json({success: true,tag_id: result._id});
    }).catch(function(err){
        return next(err);
    });

};



/*
 * 文章相关所有方法
 * */

// 添加文章
exports.addArticle = function (req,res,next) {

    console.log(req.body);

    var content = req.body.content;
    var title = req.body.title;
    var caseUrl = req.body.case_url;
    var tags = req.body.tags;
    var cover = req.body.cover;
    var preview = req.body.preview;

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

// 获取博客列表
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

    //var tags = req.query.tags;
    //console.log(tags);

    Article.find()
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

// 删除博客
exports.destroy = function (req,res,next) {
    var id = req.params.id;
    Article.findByIdAndRemoveAsync(id).then(function() {
        return res.status(200).send({success: true});
    }).catch(function (err) {
        return next(err);
    });
};