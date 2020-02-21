const KU = require('./api_consumers/kundeunivers_client');
const MDB = require('./api_consumers/mdb_client');
const BPC = require('./bpc_client');
const MailChimp = require('./api_consumers/mailchimp_client');
const Http = require('./lib/http');
const {notFound, forbidden, tooManyRequests} = require('boom');
const ZenDesk = require('./api_consumers/zendesk_client');
const {categories} = require('./api_consumers/categories_client');
const JWT = require('./lib/jwt');
const Gigya = require('./api_consumers/gigya_client');

module.exports.register = function (server, options, next) {

  server.ext('onRequest', function (request, reply) {
    var redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : request.server.info.protocol === 'http'

    if (redirect) {
      return reply()
        .redirect('https://' + request.headers.host + request.url.path)
        .code(301)
    }
    reply.continue()
  })
  server.ext('onPreResponse', function(request, reply) {

    if(request.route.path.startsWith('/mine-data')) {
      request.response.header("X-Frame-Options", "SAMEORIGIN");
      request.response.header("X-XSS-Protection", "1; mode=block");
      request.response.header("Content-Security-Policy", "default-src 'unsafe-eval' https:; style-src 'unsafe-inline' https:");
      request.response.header("X-Content-Type-Options", "nosniff");
      request.response.header("Strict-Transport-Security", "max-age=63072000");
    }

    return reply.continue();

  });

  server.route({
    method: 'get',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'mine-data/build'
      }
    }
  });

  ['/register', '/valider-email', '/verserende-email', '/reset-password'].forEach(route => {
    server.route({
      method: 'get',
      path: route,
      config: {
        auth: false
      },
      handler: (req, reply) => {
        reply.file('mine-data/build/index.html');
      }
    });
  });

  server.route({
    method: 'get',
    path: '/config',
    config: {
      auth: false
    },
    handler: (req, reply) => {
      reply({
        gigyaApiKey: process.env.GIGYA_API_KEY || '',
        trackingId: process.env.GA_TRACKING_ID || '',
        bpcUrl: process.env.BPC_URL || '',
        bpcAppId: process.env.NYHEDSBREVEPROFIL_APP_ID
      });
    }
  });

  server.route({
    method: 'post',
    path: '/ticket/{rsvp}',
    config: {
      auth: false
    },
    handler: (req, reply) => {
      BPC.getUserTicket(req.params.rsvp).then(userTicket => {
        reply(JWT.generateToken(userTicket, req.payload));
      }).catch(err => {
        reply(Http.wrapError(err));
      });
    }
  });

  server.route({
    method: 'get',
    path: '/category/kundeunivers',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => KU.fetchAllData(JWT.decodeRequest(req).uid))
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mdb',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findUser(JWT.decodeRequest(req).email))
        .then(user => {
          if (user && user.ekstern_id) {
            return MDB.getData(user.ekstern_id).then(allData => reply(allData));
          } else {
            reply(notFound());
          }
        })
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/surveygizmo',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findSurveyGizmoUser(JWT.decodeRequest(req).email))
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mailchimp',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MailChimp.getData(JWT.decodeRequest(req).email))
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mdb/permissions/{permissionId}',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findUser(JWT.decodeRequest(req).email))
        .then(user => {
          if (user && user.ekstern_id) {
            return MDB.deletePermissions(user.ekstern_id, req.params.permissionId)
              .then(response => reply(response));
          } else {
            reply(notFound());
          }
        })
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mdb/nyhedsbreve/{newsletterId}',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findUser(JWT.decodeRequest(req).email))
        .then(user => {
          if (user && user.ekstern_id) {
            return MDB.deleteNewsletter(user.ekstern_id, req.params.newsletterId)
              .then(response => reply(response));
          } else {
            reply(notFound());
          }
        })
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mdb/interesser/{interestId}',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findUser(JWT.decodeRequest(req).email))
        .then(user => {
          if (user && user.ekstern_id) {
            return MDB.deleteIterests(user.ekstern_id, req.params.interestId)
              .then(response => reply(response));
          } else {
            reply(notFound());
          }
        })
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mdb/user',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findUser(JWT.decodeRequest(req).email))
        .then(user => {
          if (user && user.ekstern_id) {
            return MDB.deleteUser(user.ekstern_id)
              .then(response => reply(response));
          } else {
            reply(notFound());
          }
        })
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/surveygizmo/{surveyId}/{responseId}',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.deleteSurveyGizmoResponse(req.params.surveyId, JWT.decodeRequest(req).email, req.params.responseId))
        .then(response => reply(response))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mailchimp/{listId}/{userId}',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MailChimp.getData(JWT.decodeRequest(req).email))
        .then(mailChimpData => {
          if (mailChimpData.some(item => item.list_id === req.params.listId && item.id === req.params.userId)) {
            return MailChimp.delete(req.params.listId, req.params.userId)
          }

          return forbidden();
        })
        .then(response => reply(response))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'POST',
    path: '/zendesk/request',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      const jwtTicket = JWT.decodeRequest(req);

      BPC.validateRequest(req)
        .then(() => ZenDesk.mapRequestToTicket(req))
        .then(payload => ZenDesk.createTicket(payload))
        .then(response => {
          BPC.addZenDeskTicket(jwtTicket.uid, response.ticket)
            .then(() => reply(response && response.ticket.id).code(201))
            .catch(err => reply(ZenDesk.wrapError(err)));
        })
        .catch(err => reply(ZenDesk.wrapError(err)));
    }
  });

  server.route({
    method: 'GET',
    path: '/zendesk/check',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      ZenDesk.requestAllowed(JWT.decodeRequest(req).uid)
        .then(allowed => {
          reply({allowed});
        })
        .catch(err => reply(ZenDesk.wrapError(err)));
    }
  });

  server.route({
    method: 'GET',
    path: '/categories',
    config: {
      auth: false
    },
    handler: (req, reply) => {
      reply({categories});
    }
  });

  server.route({
    method: 'DELETE',
    path: '/account',
    config: {
      auth: 'jwt'
    },
    handler: (req, reply) => {
      const uid = JWT.decodeRequest(req).uid;

      BPC.validateRequest(req)
        .then(() => KU.deleteAccount(uid))
        .then(() => Gigya.deleteAccount(uid))
        .then(() => reply(''))
        .catch(err => reply(Gigya.wrapError(err)));
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
