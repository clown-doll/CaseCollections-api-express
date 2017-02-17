'use strict';

var path = require('path');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Tag = mongoose.model('Tag');
var Article = mongoose.model('Article');
var muilter  = require('../../../util/multerUtil');

/*
 * 用户相关所有方法
 * */
exports.getUserInfo = function (req, res) {
    //console.log(req.user);
    var userId = req.user._id;
    //console.log(userId);
    User.findByIdAsync(userId).then(function (user) {
        return res.status(200).json(user.userInfo);
    }).catch(function (err) {
        return res.status(401).send({msg: "没有权限"});
    });
};



/*
 * 标签相关所有方法
 * */

// 获取标签列表
exports.getTagList = function (req, res, next) {
    var platform = req.params.platform.toLocaleLowerCase();
    var category = req.params.category;
    var keyword = req.query.key;
    var condition = {};

    if (keyword) {
        var reg = new RegExp(keyword, 'i');

        condition = {
            $or: [
                {name: {$regex: reg}}
            ]
        }
    }

    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
    var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):'';
    var startRow = (currentPage - 1) * itemsPerPage;

    var c;
    Tag.find(condition)
        .where('platform').equals(platform)
        .where('category').equals(category)
        .count(function (err, count) {
            if (err) {
                return next(err);
            }
            c = count;
        });

    Tag.find(condition)
        .where('platform').equals(platform)
        .where('category').equals(category)
        .skip(startRow)
        .limit(itemsPerPage)
        .sort('-publish_time')
        .exec().then(function (TagList) {
            return res.status(200).json({ data: TagList, count: c});
        }).then(null,function (err) {
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


// 添加标签
exports.addTag = function (req, res, next) {
    //标签名称不能重复,标签分类名称必须有.
    var error_msg;
    //console.log(req.body);

    var tagName = req.body.name;
    var tagPlatForm = req.body.platform;
    var tagCategory = req.body.category;

    if (!tagName) {
        error_msg = '标签名称不能为空.';
    } else if (!tagCategory) {
        error_msg = '必须选择一个标签分类.';
    }

    if(error_msg){
        return res.status(422).send({msg: error_msg});
    }

    Tag.findOneAsync({name: tagName, platform: tagPlatForm, category: tagCategory}).then(function (tag) {
        if (tag) {
            return res.status(403).send({msg: '标签名称已经存在.'});
        } else {
            return Tag.createAsync(req.body).then(function (result) {
                return res.status(200).json({success: true, tag_id: result._id});
            });
        }
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
        return res.status(200).json({success: true,data: result});
    }).catch(function(err){
        return next(err);
    });
};


/*
 * 文章相关所有方法
 * */

// 获取博客列表
exports.getArticleList = function (req,res,next) {
    var conditions = {};
    var keyword = req.query.key;

    if (keyword) {
        console.log(req.query.key);
        var reg = new RegExp(keyword, 'i');

        conditions = {
            $or: [
                {title: {$regex: reg}}
            ]
        }
    }

    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
    var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
    var startRow = (currentPage - 1) * itemsPerPage;

    var c;
    Article.count(conditions, function (err, count, next) {
        if (err) {
            return next(err);
        }
        c = count;
    });

    Article.find(conditions,{title: 1, publish_time: 1, _id: 1})
        .skip(startRow)
        .limit(itemsPerPage)
        .sort('-publish_time')
        .exec().then(function (ArticleList) {
        return res.status(200).json({ data: ArticleList, count: c});
    }).then(null,function (err) {
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

// 添加文章
exports.addArticle = function (req,res,next) {

    var content = req.body.content;
    var title = req.body.title;
    var caseUrl = req.body.case_url;
    var tags = req.body.tags;
    /*var cover = req.body.cover;
    var preview = req.body.preview;*/

    var error_msg;
    if (!title) {
        error_msg = '标题不能为空.';
    } else if (!content) {
        error_msg = '内容不能为空.';
    } else if (!caseUrl) {
        error_msg = '案例地址不能为空';
    } else if (!tags) {
        error_msg = '分类不能为空';
    }

    if (error_msg) {
        return res.status(422).send({msg: error_msg});
    }

    return Article.createAsync(req.body).then(function (result) {
        return res.status(200).json({success: true, article_id: result._id});
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


// 博客更新
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
        error_msg = '分类不能为空';
    }

    if (error_msg) {
        return res.status(422).send({msg: error_msg});
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




exports.Upload = function (req, res, next) {
    var upload = muilter.array('file');

    upload(req, res, function (err) {
        //添加错误处理
        if (err) {
            return  console.log(err);
        }

        var paths = req.files[0].path.split('\\');
        paths.shift();

        return res.status(200).json({success:true,images: `http://192.168.238.24:9000/${paths.join('/')}`});
    });

};

