var mongoose = require('mongoose');
var User = mongoose.model('User');

//后台获取用户列表
exports.getUserList = function (req,res,next) {
    /*var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
    var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
    var startRow = (currentPage - 1) * itemsPerPage;

    var sortName = String(req.query.sortName) || "created";
    var sortOrder = req.query.sortOrder;
    if(sortOrder === 'false'){
        sortName = "-" + sortName;
    }


    User.countAsync().then(function (count) {
        return User.find({})
            .skip(startRow)
            .limit(itemsPerPage)
            .sort(sortName)
            .exec().then(function (userList) {
                return res.status(200).json({ data: userList, count:count });
            })
    }).catch(function (err) {
        return next(err);
    })*/

    User.countAsync().then(function (count) {
        return User.find({})
            .exec().then(function(userList){
                return res.status(200).json({ data: userList, count:count });
            })
    }).catch(function (err) {
        return next(err);
    })

};



exports.getMe = function (req, res) {
    var userId = req.user._id;
    console.log(userId);
    User.findByIdAsync(userId).then(function (user) {
        return res.status(200).json(user.userInfo);
    }).catch(function (err) {
        console.log(err);
        return res.status(401).send();
    });
};