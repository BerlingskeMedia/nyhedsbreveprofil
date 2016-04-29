/*jshint node: true */
'use strict';


module.exports.register = function (server, options, next) {

  // server.route({
  //   method: 'get',
  //   path: '/bower_components/{param*}',
  //   handler: {
  //     directory: {
  //       path: 'bower_components'
  //     }
  //   }
  // });

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'opdatering'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/',
    handler: {
      file: 'opdatering/index.html'
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'opdatering',
  version: '1.0.0'
};
