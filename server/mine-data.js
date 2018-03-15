/*jshint node: true */
'use strict';

var backend = require('./backend');

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/build/{param*}',
    handler: {
      directory: {
        path: 'mine-data/build'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'mine-data/assets'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      file: 'mine-data/index.html'
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
