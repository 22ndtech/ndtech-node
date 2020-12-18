"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvironmentSpecificConfiguration = void 0;
const bunyan = require('bunyan');
var setEnvironmentSpecificConfiguration = function (config) {
    console.log('inside setEnvironmentSpecificConfiguration for dev');
    process.env.APP_SERVER_NAME = 'localhost';
    process.env.APP_SERVER_PORT = "8081";
    process.env.APP_SERVER_HTTPS = "false";
    process.env.APP_DB_PATH = 'mongodb://localhost/dev-productsdb';
    config.jwtSecret = 'developmentJwtSecret';
    config.server.endiciaUrl = 'https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx';
    config.server.endiciaPassPhrase = 'ENDICIA_PASS_PHRASE';
    config.server.endiciaDbHost = 'localhost';
    config.server.endiciaDbUser = '22ndtech_test';
    config.server.endiciaDbPassword = 'ENDICIA_DB_PASSWORD';
    config.server.endiciaDbDatabase = '22ndtech_test';
    config.server.stripe_account = 'STRIPE_ACCOUNT';
    config.logger = {};
    config.logger_options = {
        name: process.env.APP_SERVER_NAME,
        src: true,
        streams: [
            {
                level: 'debug',
                stream: process.stdout // log INFO and above to stdout
            },
            {
                level: 'debug',
                path: './22ndtech-dev-error.log' // log ERROR and above to a file
            }
        ],
        serializers: {
            app: function (app) {
                if (app) {
                    return {
                        appName: app.name,
                        appUrl: app.url
                    };
                }
            },
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res
        }
    };
    config.server.stripe_api_key = 'STRIPE_API_KEY';
    process.env.AWS_PROFILE = 'apgv-public-rw-test';
    config.aws = {};
    config.aws.mainSiteBucket = 'apgv-public-read-test';
    config.aws.imagesFolder = config.aws.websiteBucket + '/img';
};
exports.setEnvironmentSpecificConfiguration = setEnvironmentSpecificConfiguration;
//# sourceMappingURL=dev.config.js.map