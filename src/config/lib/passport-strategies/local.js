var passport = require('passport-restify'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports.getLocal = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({
            userName: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'User Unknown' });
            }

            if (!user.authenticate(password)) {
                return done(null, false, { message: 'invalid password' });
            }

            return done(null, user);
        });
    }));

    return passport;
};