'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
var isWin = /^win/.test(process.platform);
if (!isWin) {
    if (process.env.APPLICATION_WORKING_DIR) {
        const sleep = require('sleep');
        process.chdir(process.env.APPLICATION_WORKING_DIR);
        sleep.sleep(1);
    }
}
const CERTS_PATH = process.env.CERTS_PATH;
var config = require('./config/config');
const mongoose = require('./config/lib/mongoose');
mongoose.loadModels();
var passport = require('./config/lib/passport');
passport.init();
const logger = config.logger;
logger.info("logger initialized");
const restify = require('./config/lib/restify');
let nodemailer = require('./config/lib/nodemailer')();
// const oidcProvider = require('oidc-provider');
// const oidc = new oidcProvider(config.baseUrl);
var app;
process.on('unhandledRejection', (reason, promise) => {
    logger.error({ message: 'unhandledRejection', reason: reason, promise: promise });
});
mongoose.connect(function () {
    logger.info('Inside mongoose.connect');
    try {
        app = restify.init();
    }
    catch (err) {
        logger.info("inside catch");
        logger.error(err.message);
    }
    // oidc.initialize()
    // .then(function(){
    //     // oidc.callback = (req, res) => {
    //     //     logger.debug('req = ');
    //     //     logger.debug(req);
    //     //     logger.debugg('/nres = ');
    //     //     logger.debug(res);
    //     // };
    //     app.get('/', oidc.callback);
    //     app.put('/', oidc.callback);
    //     app.post('/', oidc.callback);
    //     app.del('/', oidc.callback);
    //     app.listen(config.server.port, function () {
    //         // logger.info({ app: app }, '%s listening at %s', app.name, app.url);
    //     });
    // });
    logger.debug('after restify.init');
    logger.debug({}, 'config.server.port = %s', config.server.port);
    app.listen(config.server.port, function () {
        logger.info({ app: app }, '%s listening at %s', app.name, app.url);
    });
});
//# sourceMappingURL=app.js.map