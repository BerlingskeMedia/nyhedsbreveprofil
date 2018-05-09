const Https = require('https');
const Url = require('url');
const Joi = require('joi');

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

  mapPayloadToTicket: (payload) => {
    const modeText = payload.mode === 'insight' ? 'indsigt' : 'sletning';
    const {email, firstName, lastName, phones, address, city, zip} = payload.user;
    const name = `${firstName || ''} ${lastName || ''}`.trim();
    const custom_fields = [
      {id: 360003795594, value: name},
      {id: 360003795614, value: email},
      {id: 360003718813, value: payload.categories}
    ];

    if (phones.length) {
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

    return {
      subject: `TEST - Request ${modeText}`,
      comment: {
        body: `TEST - Jeg ønsker ${modeText} af følgende data:\n\n${payload.categories.map(c => '- '.concat(c)).join('\n')}`
      },
      requester: {name, email},
      custom_fields
    };
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
