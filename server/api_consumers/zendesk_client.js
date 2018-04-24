const Https = require('https');
const Url = require('url');
const Joi = require('joi');

var ZENDESK_URL;
const ZENDESK_API_EMAIL = process.env.ZENDESK_API_EMAIL;
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;


const createTicketSchema = Joi.object().keys({
  subject: Joi.string().required(),
  comment: Joi.object().keys({
    body: Joi.string().required()
  }).required(),
  custom_fields: Joi.array().items(Joi.object().keys({
    id: Joi.number().required(),
    value: Joi.string().required()
  })),
  requester: Joi.object().keys({
    locale_id: Joi.number().default(1000), // dansk
    name: Joi.string(),
    email: Joi.string().email()
  })
});

const stdTicketFieldValues = {
  ticket_form_id: 360000056974,       // GDPR Formular
  brand_id: 114094395074,              // Berlingske Media
  // organization_id: 116145165994    // Berlingske Media
  organization_id: 360014896433       // Berlingskemedia
};

const stdTicketCustomFieldsContactReason = { id: 114101503914, value: 'gdpr' };


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

const authorization = 'Basic ' + new Buffer(ZENDESK_API_EMAIL + '/token:' + ZENDESK_API_TOKEN).toString('base64');

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
      return Promise.reject({error: validate_result.error});
    }

    // Setting standard values
    Object.assign(ticket, stdTicketFieldValues);

    // Making sure the contact reason ("Kontakt årsag") is standard GDRP.
    if (ticket.custom_fields) {
      const temp = ticket.custom_fields.findIndex((item) => {
        return item.id = stdTicketCustomFieldsContactReason.id;
      });
      if (temp > -1) {
        ticket.custom_fields[temp] = stdTicketCustomFieldsContactReason;
      } else {
        ticket.custom_fields.push(stdTicketCustomFieldsContactReason);
      }
    } else {
      ticket.custom_fields = [stdTicketCustomFieldsContactReason];
    }

    return callZenDesk({ method: 'POST', path: '/api/v2/tickets.json', payload: { ticket: ticket }})
  },

  // TODO: Add more helper functions

  request: callZenDesk
};


function callZenDesk({method = 'GET', path, payload}){
  const options = {
    protocol: ZENDESK_URL.protocol,
    hostname: ZENDESK_URL.hostname,
    path: path,
    method: method,
    headers: {
      'Authorization': authorization,
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
