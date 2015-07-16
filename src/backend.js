/*jshint node: true */

var backend = {
  register: function (plugin, options, next) {

    plugin.route({
      method: ['get', 'put', 'post', 'patch'],
      path: '/{path*}',
      handler: {
        proxy: {
          mapUri: function(request, callback) {
            callback(null, 'http://54.77.4.249:8000/' + request.params.path);
          } //
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
