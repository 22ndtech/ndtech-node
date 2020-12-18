'use strict';

let usersController = require('../controllers/users.controller');
var passport = require('passport-restify');
let jwt = require('jsonwebtoken');
var config = require('../../../config/config');


module.exports = function (app) {
    // Define application status route
    
    app.post('/users', usersController.create);

    app.post(
        '/users/sign-in',
    function (req, res, next) {
        
        var user = req.body;
        req.username = user.userName;
        req.password = user.password;
            
            passport.authenticate(
                'local',
        function (err, user, info) {
                    
                    if (err) {
                        return next(err);
                    }
                    
                    if (!user) {
                        return res.json(401, { message: 'error logging in' });
                    }
                    
                    var token = jwt.sign(user, config.jwtSecret, {
                        expiresIn: 180
                    })
                    
                    res.setCookie('jsonWebToken', token, { httpOnly: true, secure: true });
                    
                    res.setCookie('cookie2', token, { httpOnly: true, secure: true });
                    
                    res.json({ 'authenticated': true, 'userName': user.userName, 'userId' : user._id });
                }
            )(req, res, next);
        }
    )
    
    app.get('/users/:id', usersController.decodeToken, usersController.getUserById);

    app.get('/users', usersController.decodeToken, usersController.list);
    
    app.del('/users/:id', usersController.deleteUser);

    app.post('/users/sign-out', usersController.signout);
    
    app.post('/users/requestPasswordReset', usersController.requestPasswordReset);
    app.post('/users/resetPassword', usersController.resetPassword);
    
    app.param('userId', usersController.userById);
    
    app.param('hash', usersController.resetPasswordByHash);
};