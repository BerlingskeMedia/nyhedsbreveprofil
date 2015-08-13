/*jshint node: true */

var api_url = process.env.MDBAPI_ADDRESS + ':' + process.env.MDBAPI_PORT;

var backend = {
  register: function (plugin, options, next) {

    plugin.route({
      method: ['get', 'put', 'post', 'patch', 'delete'],
      path: '/{path*}',
      handler: {
        proxy: {
          mapUri: function(request, callback) {
            var query = request.url.search ? request.url.search : '';
            var url = 'http://' + api_url + '/' + request.params.path + query;
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
