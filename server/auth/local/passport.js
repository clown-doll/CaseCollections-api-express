var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  //使用JSON Web令牌进行身份验证的passport策略。 https://www.npmjs.com/package/passport-jwt

exports.setup = function (User, config) {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({
                username: username
            }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    // logger.error('登录用户名错误',{'username':email});
                    return done(null, false, { error_msg: '用户名或密码错误.' });
                }
                if (!user.authenticate(password)) {
                    // logger.error('登录密码错误',{'username':email});
                    return done(null, false, { error_msg: '用户名或密码错误.' });
                }

                return done(null, user);
            });
        }
    ));
};

