const KU = require('./api_consumers/kundeunivers_client');
const {wrap} = require('boom');

module.exports.register = function (server, options, next) {

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'mine-data/build'
      }
    }
  });

  server.route({
    method: 'get',
    path: '/{userId}/category/{categoryName}',
    handler: (req, reply) => {
      switch (req.params.categoryName) {
        case 'kundeunivers':
          KU.fetchAllData(req.params.userId, req.params.categoryName)
            .then(allData => reply(allData))
            .catch(err => reply(wrap(err)));
      }
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
