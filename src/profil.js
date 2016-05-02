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
        path: 'assets'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      file: 'client/index.html'
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'profil',
  version: '1.0.0'
};
