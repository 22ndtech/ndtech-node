'use strict';

const config = require('../config');
const path = require('path');
const mongoose = require('mongoose');
const logger = config.logger;

mongoose.Promise = global.Promise;

module.exports.loadModels = function() {
  if (config.files.models) {
    config.files.models.forEach(function(modelPath) {
      require(path.resolve(modelPath));
    });
  }
};

module.exports.connect = function(cb) {
  let db;

  db = mongoose.connect(config.db.path, (err) => {
    if (err) {
      logger.error({}, 'Could not connect to MongoDB %s', err);
    } else {
      // this.loadModels();
      logger.info({}, 'Connected to MongoDB %s', config.db.path);
      if (cb) {
        cb(db);
      }
    }
  });
};

module.exports.disconnect = function(cb) {
  mongoose.disconnect((err) => {
    logger.info({}, 'Disconnect from MongoDB');
    cb(err);
  });
};
