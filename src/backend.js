/*jshint node: true */

var backend = {
  register: function (plugin, options, next) {

    plugin.route({
      method: 'get',
      path: '/',
      handler: function (request, reply) {
        reply('HEY');
      }
    });

    next();
  }
};

backend.register.attributes = {
  name: 'backend',
  version: '1.0.0'
};

module.exports = backend