'use strict';

const restify = require('restify');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const passport = require('passport-restify');
const cookieParser = require('restify-cookies');

module.exports.initModuleServerRoutes = function (app) {
    config.files.routes.forEach((route) => {
        require(path.resolve(route))(app);
    });
};

module.exports.init = function () {
    const serverOptions = {
        log: config.logger,
        name: config.server.name,
        certificate: config.server.https === 'true' ? fs.readFileSync($CERTS_PATH + '/server.crt', 'utf8') : null,
        key: config.server.https === 'true' ? fs.readFileSync($CERTS_PATH + '/server.pem', 'utf8') : null,
    };
    const app = restify.createServer(serverOptions);

    app.use(restify.CORS({credentials: true})); // eslint-disable-line new-cap
    app.use(cookieParser.parse);
    app.use(restify.bodyParser());
    app.use(restify.queryParser());

    //app.set('jwtSecret', config.jwtSecret);

    app.use(passport.initialize());
    app.use(passport.session());

    this.initModuleServerRoutes(app);

    return app;
};
