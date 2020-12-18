// var port = process.env.APP_SERVER_NAME;


// var scheme = baseconfig.server.https == 'true' ? 'https://' : 'http://';

// import { setEnvironmentSpecificConfiguration } from './dev.config';

// export var config = {
//     "port": baseconfig.server.port,
//     "server": baseconfig.server.name,
//     "baseUrl": scheme + baseconfig.server.name + ':' + baseconfig.server.port
// }

// var configuration = {
//     "port": baseconfig.server.port,
//     "server": baseconfig.server.name,
//     "baseUrl": scheme + baseconfig.server.name + ':' + baseconfig.server.port
// }

export var getConfig = function(){
    // if(process.env.APP_ENVIRONMENT == 'dev'){
    //     process.env.APP_SERVER_NAME = 'localhost';
    //     process.env.APP_SERVER_PORT = 8081;
    //     process.env.APP_SERVER_HTTPS = false;
    //     process.env.APP_DB_PATH = 'mongodb://localhost/productsdb';
    // } else if(process.env.APP_ENVIRONMENT == 'prod'){
    //     process.env.APP_SERVER_NAME = 'ec2-34-207-115-234.compute-1.amazonaws.com';
    //     process.env.APP_SERVER_PORT = 80;
    //     process.env.APP_SERVER_HTTPS = false;
    //     process.env.APP_DB_PATH = 'mongodb://localhost/productsdb';
    // }

    return require('./config');
    
    // return Object.assign(config, {
    //     "scheme" : config.server.https == 'true' ? 'https://' : 'http://',
    //     "port": config.server.port,
    //     "server": config.server.name,
    //     "baseUrl": config.server.https == 'true' ? 'https://' : 'http://' + config.server.name + ':' + config.server.port
    // });

}