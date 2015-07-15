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

    plugin.route({
      method: 'get',
      path: '/nyhedsbreve',
      handler: {
        proxy: {
          uri: 'http://54.77.4.249:8000/nyhedsbreve'
        }
    }
    });

    plugin.route({
      method: 'get',
      path: '/interesser',
      handler: {
        proxy: {
          uri: 'http://54.77.4.249:8000/interesser?displayTypeId=3'
        }
    }
    });

    plugin.route({
      method: 'post',
      path: '/users',
      handler: {
        proxy: {
          uri: 'http://54.77.4.249:8000/users'
        }
    }
    });

    plugin.route({
      method: 'post',
      path: '/mails/profile-page-link',
      handler: {
        proxy: {
          uri: 'http://54.77.4.249:8000/mails/profile-page-link'
        }
    }
    });


    plugin.route({
      method: ['get', 'put', 'post', 'patch'],
      path: '/users/{ekstern_id}/interesser',
      handler: {
        proxy: {
          uri: 'http://54.77.4.249:8000/users/11ffbd194645c9b3fbda06bf62dbb17b/interesser'
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
