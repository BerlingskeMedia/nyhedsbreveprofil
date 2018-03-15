/*jshint node: true */
'use strict';

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/bower_components/{param*}',
    handler: {
      directory: {
        path: 'bower_components'
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
