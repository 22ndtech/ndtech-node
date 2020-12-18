/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        match: [/.+\@.+\..|/, 'Please enter a valid e-mail address']
    },
    userName: {
        type: String,
        unique: true,
        required: 'userName is required'
    },
    password: {
        type: String,
        validate: [
            function (password) {
                return password && password.length > 6;
            },
            'Password must be at least 7 characters'
        ]
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'provider is required'
    },
    providerId: String,
    providerData: {}
});

UserSchema.set('timestamps', true); // include timestamps in docs

UserSchema.pre(
'save', 
function (next){
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
}
)

UserSchema.methods.hashPassword = function (password) {
return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

UserSchema.methods.authenticate = function (password) {
return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function (userName, suffix, callback) {
var _this = this;
var possibleUserName = userName + (suffix || '');

_this.findOne(
    { userName: possibleUserName },
    function (err, user){
        if (!err) {
            if (!user) {
                callback(possibleUserName);
            } else {
                return _this.findUniqueUserName(userName, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    })
};

UserSchema.set(
'toJSON',
{
    getters: true,
    virtuals: true
});


// apply the mongoose unique validator plugin to widgetSchema
UserSchema.plugin(uniqueValidator);

export
var UserModel = mongoose.model('User', UserSchema);
