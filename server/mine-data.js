/*jshint node: true */
'use strict';

var backend = require('./backend');

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'mine-data/build'
      }
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
