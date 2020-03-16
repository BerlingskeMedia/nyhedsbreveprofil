/*jshint node: true */
'use strict';

var backend = require('./backend');

module.exports = {
  name: 'opdatering',
  version: '1.0.0',

  register: async function (server, options) {

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

    server.route({
      method: 'post',
      path: '/finished',
      handler: sendThankYouReciept
    });
  }
}


function sendThankYouReciept(request, h) {
  return backend.proxy({
    method: 'POST',
    url: {
      path: '/mails/send'
    },
    payload: {
      to: request.payload.email,
      template: '35f86245-ff99-4b23-95c6-c4d81615594f',
      category: 'opdateringskampagne-kvittering',
      substitutions: request.payload !== null ? request.payload : { fornavn: ''}
    },
    headers: {}
  });
}
