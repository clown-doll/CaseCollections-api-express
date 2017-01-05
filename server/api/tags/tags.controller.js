'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

//获取标签列表
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

//添加标签
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

//删除标签
exports.deleteTag = function (req, res, next) {
    var id = req.params.id;
    return Tag.findByIdAndRemoveAsync(id).then(function() {
        return res.status(200).json({success: true});
    }).catch(function (err) {
        return next(err);
    });
};

//更新标签
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

//前台数据
exports.getFrontTagList = function (req, res, next) {
    //console.log(req);
    var platform = req.params.platform.toLocaleLowerCase();
    //console.log(platform);

    Tag.findAsync({platform: platform}).then(function (result) {
        return res.status(200).json({data: result});
    }).catch(function (err) {
        return next(err);
    });
};
