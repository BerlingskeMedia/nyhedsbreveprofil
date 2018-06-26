/*jshint node: true */
'use strict';

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/node_modules/{param*}',
    handler: {
      directory: {
        path: 'node_modules'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'nyhedsbreve/assets'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      file: 'nyhedsbreve/index.html'
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'nyhedsbreve',
  version: '1.0.0'
};
