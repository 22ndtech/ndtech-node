'use strict';

const glob = require('glob');
const _ = require('lodash');
const path = require('path');
const bunyan = require('bunyan');

/*
 * Get files by glob patterns
 */
const getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach((globPattern) => {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns, { cwd: process.cwd() });
            if (excludes) {
                files = files.map((file) => {
                    if (_.isArray(excludes)) {
                        for (let i in excludes) {
                            if ({}.hasOwnProperty.call(excludes, i)) {
                                file = file.replace(excludes[i], '');
                            }
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};

const setupLogger = function (config) {
    return bunyan.createLogger(config.logger_options);
};

const initServerSettings = function (config) {
    config.environment = process.env.APP_ENVIRONMENT;

    var setEnvSpecificConfig;
    
    if(config.environment == 'dev') {
        setEnvSpecificConfig = require('./dev.config').setEnvironmentSpecificConfiguration;
    } else if(config.environment == 'external-test') {
        setEnvSpecificConfig = require('./dev.external-test.config').setEnvironmentSpecificConfiguration;
    } else if(config.environment == 'prod') {
        setEnvSpecificConfig = require('./prod.config').setEnvironmentSpecificConfiguration;
    } else if(config.environment == 'dev-prod-db') {
        setEnvSpecificConfig = require('./dev-prod-db.config').setEnvironmentSpecificConfiguration;
    }

    config.server = {};
    setEnvSpecificConfig(config);


    config.server.port = process.env.APP_SERVER_PORT;
    config.server.name = process.env.APP_SERVER_NAME;
    config.server.https = process.env.APP_SERVER_HTTPS;

    Object.assign(config, {
        "scheme" : config.server.https == 'true' ? 'https://' : 'http://',
        "port": config.server.port,
        "server-name": config.server.name,
        "baseUrl": config.server.https == 'true' ? 'https://' : 'http://' + config.server.name + ':' + config.server.port
    });
};

const initDbSettings = function (config) {
    config.db = {};
    config.db.path = process.env.APP_DB_PATH;
};

const initGlobalConfigFiles = function (config, assets) {
    config.files = {};
    config.files.routes = getGlobbedPaths(assets.server.routes, "");
    config.files.models = getGlobbedPaths(assets.server.models, "");
};

// const initAwsSettings = function (config) {
//     config.aws = {};

//     config.aws.accessKeyId = 'AKIAJF2O7WGHIRQMTNTA';
//     config.aws.secretKey = '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';
//     config.aws.mainSiteBucket = 'apgv-public-read';
//     config.aws.imagesFolder = config.aws.websiteBucket + '/img';
// };

const initGlobalConfig = function () {
    var config = {};
    const assets = require(path.join(__dirname, 'assets'));

    initServerSettings(config);
    initDbSettings(config);
    config.logger = setupLogger(config);
    initGlobalConfigFiles(config, assets);
    // initAwsSettings(config);

    return config;
};

module.exports = initGlobalConfig();
