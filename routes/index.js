'use strict';

var path = require('path');

module.exports = function(app) {
    app.use('/users', require('../server/api/user'));
    app.use('/auth', require('../server/auth'));
    app.use('/tags',require('../server/api/tags'));
    app.use('/articles',require('../server/api/articles'));

    app.use('/*', function (req, res, next) {
        return res.json({status: 'success', data: 'API is alive!'});
    })
};

