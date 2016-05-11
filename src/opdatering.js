/*jshint node: true */
'use strict';

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/build/{param*}',
    handler: {
      directory: {
        path: 'opdatering/build'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'opdatering/assets'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      file: 'opdatering/index.html'
    }
  });

  // server.route({
  //   method: 'get',
  //   path: '/{param*}',
  //   handler: {
  //     directory: {
  //       path: 'opdatering'
  //     }
  //   }
  // });
  //
  // server.route({
  //   method: 'get',
  //   path: '/',
  //   handler: {
  //     file: 'opdatering/index.html'
  //   }
  // });

  next();
};

module.exports.register.attributes = {
  name: 'opdatering',
  version: '1.0.0'
};
