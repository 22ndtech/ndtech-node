'use strict';

module.exports = {
  server: {
    allJs: [
      'src/app.js',
      'src/config/**/*.js',
      'src/modules/**/*.js'
    ],
    models: 'src/modules/*/models/**/*.model.js',
    routes: 'src/modules/*/routes/**/*.routes.js',
    controllers: 'src/modules/*/controllers/**/*.controller.js'
  }
};
