const Https = require('https');
const Url = require('url');
const Joi = require('joi');
const MDB = require('./mdb_client');
const KU = require('./kundeunivers_client');
const {categories} = require('./categories_client');
const JWT = require('../lib/jwt');
const BPC = require('../bpc_client');
const {badRequest} = require('boom');
const Http = require('../lib/http');

var ZENDESK_URL;
const ZENDESK_API_EMAIL = process.env.ZENDESK_API_EMAIL;
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

try {
  ZENDESK_URL = Url.parse(process.env.ZENDESK_URL);
} catch (ex) {
  console.error('Env var ZENDESK_URL missing or invalid.');
  process.exit(1);
}

if (!ZENDESK_API_EMAIL || ZENDESK_API_EMAIL.length === 0) {
  console.error('Env var ZENDESK_API_EMAIL missing or invalid.');
  process.exit(1);
}

if (!ZENDESK_API_TOKEN || ZENDESK_API_TOKEN.length === 0) {
  console.error('Env var ZENDESK_API_TOKEN missing or invalid.');
  process.exit(1);
}


const createTicketSchema = Joi.object().keys({
  subject: Joi.string().required(),
  comment: Joi.object().keys({
    body: Joi.string().required()
  }).required(),
  custom_fields: Joi.array().items(Joi.object().keys({
    id: Joi.number().required(),
    value: [Joi.string(), Joi.array().items(Joi.string())]
  })),
  requester: Joi.object().keys({
    locale_id: Joi.number().default(1000), // dansk
    name: Joi.string(),
    email: Joi.string().email()
  }),
  tags: Joi.array().items(Joi.string())
});


const stdTicketFieldValues = {
  ticket_form_id: 360000056974,       // Ticket form: GDPR Formular
  brand_id: 114094395074,             // Brand: Berlingske Media
  // organization_id: 116145165994    // Berlingske Media
  organization_id: 360014896433,      // Berlingskemedia,
  type: 'task',                       // Allowed values are problem, incident, question, or task
  priority: 'normal',                 // Allowed values are urgent, high, normal, or low
  status: 'new'                       // Allowed values are new, open, pending, hold, solved or closed
};


const customFieldsContactReason = { id: 114101503914, value: 'gdpr' };
const stdTicketCustomFields = [customFieldsContactReason];


const authorizationHeader = 'Basic ' + new Buffer(ZENDESK_API_EMAIL + '/token:' + ZENDESK_API_TOKEN).toString('base64');


module.exports = {

  getTickets: function() {
    return callZenDesk({ path: '/api/v2/tickets.json' })
  },


  getTicket: function({id}) {
    return callZenDesk({ path: `/api/v2/tickets/${id}.json` })
  },


  createTicket: function(ticket) {
    const validate_result = Joi.validate(ticket, createTicketSchema, { convert: false });
    if(validate_result.error) {
      return Promise.reject(validate_result.error);
    }

    // Setting standard values
    Object.assign(ticket, stdTicketFieldValues);

    // Setting standard custom fields
    if (ticket.custom_fields) {

      stdTicketCustomFields.forEach(stdTicketCustomField => {

        const indexOfContactReasonCustomField = ticket.custom_fields.findIndex((item) => {
          return item.id === stdTicketCustomField.id;
        });

        if (indexOfContactReasonCustomField > -1) {
          ticket.custom_fields[indexOfContactReasonCustomField] = stdTicketCustomField;
        } else {
          ticket.custom_fields.push(stdTicketCustomField);
        }

      });
    } else {
      ticket.custom_fields = stdTicketCustomFields;
    }

    return callZenDesk({ method: 'POST', path: '/api/v2/tickets.json', payload: { ticket: ticket }})
  },

  mapRequestToTicket: (req) => {
    const jwt = JWT.decodeRequest(req);
    const modeText = req.payload.mode === 'insight' ? 'INDSIGT' : 'SLET';
    const {firstName, lastName, phones, address, city, zip} = req.payload.user;
    const email = jwt.email;
    const uid = jwt.uid;
    const name = `${firstName || ''} ${lastName || ''}`.trim() || '[Kunde]';
    const custom_fields = [
      {id: 360005004613, value: uid},
      {id: 360003795594, value: name},
      {id: 360003795614, value: email},
      {id: 360003718813, value: req.payload.categories}
    ];
    const payloadCategories = req.payload.categories
      .map(c => categories.find(category => category.name === c))
      .filter(c => !!c);

    if (phones && phones.length) {
      custom_fields.push({
        id: 360003718633,
        value: phones[0].number
      });
    }

    if (address || city || zip) {
      custom_fields.push({
        id: 360003774853,
        value: `${address || ''} ${zip || ''} ${city || ''}`.trim()
      });
    }

    return MDB.findUser(email).then(user => {
      if (user && user.ekstern_id) {
        custom_fields.push({
          id: 360004449334, value: user.ekstern_id
        });
      }

      return KU.fetchAllDataSimple(uid).then(orders => {
        if (orders.orders.length > 0) {
          const [orderNumbers, businessPartnerIds] = orders.orders.reduce(([orderIds, partnerIds], order) => {
            return [
              [...orderIds, order.sap_order_id],
              [...partnerIds, ...order.items.map(item => item.business_partner_id)]
            ];
          }, [[], []]);

          if (orderNumbers.length) {
            custom_fields.push({
              id: 360005127574, value: orderNumbers
            });
            custom_fields.push({
              id: 360005127594, value: businessPartnerIds
            });
          }
        }

        const prefix = process.env.ZENDESK_SUBJECT_PREFIX || '';

        return {
          subject: `${prefix}${modeText}: ${name}`,
          comment: {
            body: `${prefix}Jeg ønsker ${modeText} af følgende data:\n\n${payloadCategories.map(c => '- '.concat(c.title)).join('\n')}`
          },
          requester: {name, email},
          custom_fields
        };
      });
    });
  },

  requestAllowed: (uid) => {
    return BPC.getUserScopeData(uid, 'zendesk').then(({tickets}) => {
      const latestTicket = tickets && tickets.reduce((latest, ticket) => {
        if (!latest || ticket.createdAt > latest.createdAt) {
          return ticket;
        }

        return latest;
      }, null);

      if (!latestTicket) {
        return true;
      }

      return callZenDesk({path: `/api/v2/requests/${latestTicket.id}.json`})
        .then(ticket => ticket.request.status === 'solved')
        .catch(err => {
          if (err && err.error === 'RecordNotFound') {
            return true;
          }

          return Promise.reject(err);
        });
    });
  },

  wrapError: (err) => {
    if (err && err.error) {
      return badRequest(err.description);
    }

    return Http.wrapError(err);
  },


  // TODO: Add more helper functions if needed

  request: callZenDesk
};


function callZenDesk({method = 'GET', path, payload}){
  const options = {
    protocol: ZENDESK_URL.protocol,
    hostname: ZENDESK_URL.hostname,
    path: path,
    method: method,
    headers: {
      'Authorization': authorizationHeader,
      'Content-Type': 'application/json'
    }
  };


  const prom = new Promise((resolve, reject) => {
    const request = Https.request(options, (response) => {
      let data = '';

      response.setEncoding('utf8');

      response.on('data', (chunk) => {
        data = data + chunk;
      });

      response.on('end', () => {
        let data_json;

        try {
          data_json = JSON.parse(data);
        } catch(err) {
          return reject(err);
        }

        if (response.statusCode < 300) {
          resolve(data_json);
        } else {
          reject(data_json);
        }

      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    if(payload) {
      if (typeof payload === 'object') {
        request.write(JSON.stringify(payload));
      } else {
        request.write(payload);
      }
    }

    request.end();
  });

  return prom;
}
