/*jshint node: true */

var backend = {
  register: function (plugin, options, next) {

    plugin.route({
      method: ['get', 'put', 'post', 'patch', 'delete'],
      path: '/{path*}',
      handler: {
        proxy: {
          mapUri: function(request, callback) {
            var query = request.url.search ? request.url.search : '';
            var url = 'http://54.77.4.249:8000/' + request.params.path + query;
            callback(null, url);
          }
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
