/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordModel = void 0;
let mongoose = require('mongoose');
let uuid = require('uuid');
let Schema = mongoose.Schema;
let ResetPasswordSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    hash: {
        type: String
    },
    forUser: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
ResetPasswordSchema.set('timestamps', true); // include timestamps in docs
ResetPasswordSchema.pre('save', function (next) {
    this.hash = uuid.v4();
    next();
});
exports.ResetPasswordModel = mongoose.model('ResetPassword', ResetPasswordSchema);
//# sourceMappingURL=resetPassword.model.js.map