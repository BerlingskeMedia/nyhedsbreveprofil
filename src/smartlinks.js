/*jshint node: true */
'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    backend = require('./backend');

module.exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: backend.proxy,
    config: {
      pre: [appendReferrer]
    }
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: backend.proxy,
    config: {
      pre: [appendReferrer]
    }
  });

  next();
};

module.exports.register.attributes = {
    name: 'smartlinks',
    version: '1.0.0'
};

function appendReferrer (request, reply) {
  if (request.query)
    request.query.referrer = request.info.referrer;
  if (request.payload)
    request.payload.referrer = request.info.referrer;
  return reply();
}
