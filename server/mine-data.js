const KU = require('./api_consumers/kundeunivers_client');
const MDB = require('./api_consumers/mdb_client');
const BPC = require('./bpc_client');
const MailChimp = require('./api_consumers/mailchimp_client');
const Http = require('./lib/http');
const {notFound} = require('boom');
const ZenDesk = require('./api_consumers/zendesk_client');
const {categories} = require('./api_consumers/categories_client');
const JWT = require('./lib/jwt');

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
        reply(JWT.generateToken(userTicket));
      }).catch(err => {
        reply(Http.wrapError(err));
      });
    }
  });

  server.route({
    method: 'get',
    path: '/category/kundeunivers/{gigyaUID}',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => KU.fetchAllData(req.params.gigyaUID))
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mdb/{email}',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findUser(req.params.email))
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
    path: '/category/surveygizmo/{email}',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.findSurveyGizmoUser(req.params.email))
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'get',
    path: '/category/mailchimp/{email}',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MailChimp.getData(req.params.email))
        .then(allData => reply(allData))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/surveygizmo/{surveyId}/{email}/{responseId}',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MDB.deleteSurveyGizmoResponse(req.params.surveyId, req.params.email, req.params.responseId))
        .then(response => reply(response))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mailchimp/{listId}/{userId}',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => MailChimp.delete(req.params.listId, req.params.userId))
        .then(response => reply(response))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/surveygizmo/{surveyId}/{email}/{responseId}',
    handler: (req, reply) => {
      MDB.deleteSurveyGizmoResponse(req.params.surveyId, req.params.email, req.params.responseId)
        .then(response => reply(response))
        .catch(err => reply(Http.wrapError(err)));
    }
  });

  server.route({
    method: 'delete',
    path: '/category/mailchimp/{listId}/{userId}',
    handler: (req, reply) => {
      MailChimp.delete(req.params.listId, req.params.userId)
        .then(response => reply(response))
        .catch((err) => {
          console.error('MailChimp error:', err);
          reply(Http.wrapError(err))
        });
    }
  });

  server.route({
    method: 'POST',
    path: '/zendesk/request',
    handler: (req, reply) => {
      BPC.validateRequest(req)
        .then(() => ZenDesk.mapPayloadToTicket(req.payload))
        .then(payload => ZenDesk.createTicket(payload))
        .then(() => {
          reply(null, '');
        })
        .catch(err => reply(Http.wrapError(err)));
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

  next();
};

module.exports.register.attributes = {
  name: 'mine-data',
  version: '1.0.0'
};
