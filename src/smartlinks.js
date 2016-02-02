/*jshint node: true */
'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    backend = require('./backend');

module.exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: backend.proxy
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: backend.proxy
  });

  next();
};

module.exports.register.attributes = {
    name: 'smartlinks',
    version: '1.0.0'
};
