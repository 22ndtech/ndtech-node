"use strict";
///// <reference path="../../../../typings/globals/mocha/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
var chakram = require('chakram'), expect = chakram.expect;
const test_config_1 = require("../../../config/test.config");
var config = test_config_1.getConfig();
function parseCookie(cookie) {
    return cookie.split(';').reduce(function (prev, curr) {
        var m = / *([^=]+)=(.*)/.exec(curr);
        var key = m[1];
        var value = decodeURIComponent(m[2]);
        prev[key] = value;
        return prev;
    }, {});
}
function parseCookies(cookiesString) {
    var cookies = [];
    cookiesString.forEach(cookieString => {
        // console.log('cookieString = ' + cookieString);
        var cookieElements = cookieString.split('; ');
        // console.log('cookieElements = ' + JSON.stringify(cookieElements, null, 2));
        var cookieNameValues = cookieElements[0].split('=');
        // console.log('cookieNameValues = ' + JSON.stringify(cookieNameValues, null, 2));
        var cookie = {
            name: cookieNameValues[0],
            value: cookieNameValues[1],
            HttpOnly: cookieElements.find(element => element == 'HttpOnly') ? true : false,
            Secure: cookieElements.find(element => element == 'Secure') ? true : false
        };
        // console.log('cookie = ' + JSON.stringify(cookie, null, 2));
        cookies[cookies.length] = cookie;
        // console.log('cookies = ' + JSON.stringify(cookies, null, 2));
    });
    // console.log('cookies = ' + JSON.stringify(cookies, null, 2));
    return cookies;
}
describe("verify environment", function () {
    it('should have process.env.APP_SERVER_NAME equal to "localhost"', function () {
        expect(process.env.APP_SERVER_NAME).to.equal('localhost');
    });
});
describe("create user", function () {
    let user = {
        firstName: 'Jeff',
        lastName: 'Hegedus',
        email: 'Jeff@22ndTech.com',
        userName: 'Jeff@22ndTech.com',
        password: 'jeff-hegedus-password'
    };
    var userId;
    // var postUserRequest;
    // beforeEach(function () {
    //     postUserRequest = chakram.post(
    //         config.baseUrl + '/users',
    //         user);
    // });
    it("should return the created user", function () {
        return chakram.post(config.baseUrl + '/users', user).then(function (postUserResponse) {
            // console.log('postUserResponse.body = ' + JSON.stringify(postUserResponse.body, null, 2));
            expect(postUserResponse.body.firstName).to.equal('Jeff');
            expect(postUserResponse.body.lastName).to.equal('Hegedus');
            expect(postUserResponse.body.email).to.equal('Jeff@22ndTech.com');
            expect(postUserResponse.body.userName).to.equal('Jeff@22ndTech.com');
            expect(postUserResponse.body.id).to.exist;
            userId = postUserResponse.body._id;
            // console.log('userId = ' + userId);
        });
    });
    var token;
    it("should sign in as the user", function () {
        return chakram.post(config.baseUrl + '/users/sign-in', { user: user, username: user.userName, password: user.password })
            .then(function (signInResponse) {
            // console.log('signInResponse = ' + JSON.stringify(signInResponse, null, 2));
            //expect(signInResponse).to.have.cookie('jsonWebToken');
            expect(signInResponse.body.authenticated).to.equal(true);
            var cookiesString = signInResponse.response.headers['set-cookie'];
            // console.log('cookiesString = ' + JSON.stringify(cookiesString, null, 2));
            // var cookie0 = cookiesString[0];
            // console.log('cookie0 = ' + JSON.stringify(cookie0, null, 2));
            var cookies = parseCookies(cookiesString);
            // console.log('cookies[0] = ' + JSON.stringify(cookies[0], null, 2));
            //console.log(signInResponse.response.headers['set-cookie']);
            var jsonWebTokenCookie = cookies.find(cookie => cookie.name == 'jsonWebToken');
            expect(jsonWebTokenCookie.name).to.equal('jsonWebToken');
            token = jsonWebTokenCookie.value;
        });
    });
    it("should get the user by id", function () {
        return chakram.get(config.baseUrl + '/users/' + userId, { headers: { 'Cookie': 'jsonWebToken=' + token } })
            .then(function (getUserResponse) {
            // console.log('getUserResponse.body = ' + JSON.stringify(getUserResponse.body, null, 2));
            expect(getUserResponse.body.userName).to.equal('Jeff@22ndTech.com');
        });
    });
    it('should get all users', function () {
        return chakram.get(config.baseUrl + '/users', { headers: { 'Cookie': 'jsonWebToken=' + token } })
            .then(function (getAllUsersResponse) {
            // console.log('getAllUsersResponse = ' + JSON.stringify(getAllUsersResponse, null, 2));
            var users = getAllUsersResponse.body;
            expect(users.length).to.be.gt(0);
        });
    });
    it("should delete the user created", function () {
        return chakram.del(config.baseUrl + '/users/' + userId).then(function (deleteUserResponse) {
            expect(deleteUserResponse.response.statusCode).to.equal(200);
            // console.log('deleteUserResponse = ' + JSON.stringify(deleteUserResponse, null, 2));
        });
    });
});
// describe("get users", function () {
//    var getUsersRequest;
//    var users;
//    it('should get all users', function () {
//        return chakram.get(
//            config.baseUrl + '/users')
//            .then(function (getAllUsersResponse) {
//                console.log('all users = ' + JSON.stringify(getAllUsersResponse.body));
//            })
//    });
// });
//# sourceMappingURL=user.spec.js.map