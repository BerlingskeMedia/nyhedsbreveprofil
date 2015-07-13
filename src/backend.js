/*jshint node: true */

var backend = {
  register: function (plugin, options, next) {

    plugin.route({
      method: 'get',
      path: '/publishers',
      handler: {
        proxy: {
          uri: 'http://54.77.4.249:8000/publishers'
        }
    }
    });

    next();
  }
};

backend.register.attributes = {
  name: 'backend',
  version: '1.0.0'
};

module.exports = backend;
