const request = require('request');
const BPC = require('../bpc_client');
const {boomify, badImplementation, badRequest} = require('boom');

class Http {
  static get(url) {
    return Http.request('get', url, BPC.appTicket);
  }

  static post(url, payload) {
    return Http.request('post', url, BPC.appTicket, payload);
  }

  static request(method, uri, credentials, payload = null) {
    return new Promise((fulfill, reject) => {
      request({
        uri,
        method,
        json: payload,
        hawk: credentials ? {
          credentials,
          app: credentials.app
        } : null
      }, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode > 299) {
          reject({response, body});
        } else {
          fulfill(Http.parseResponse(body));
        }
      });
    });
  }

  static parseResponse(response) {
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch (e) {
        return null;
      }
    }

    return response;
  }

  static wrapError(err) {
    if (err.response) {
      console.log('[response error]', err.response.statusCode, err.response.statusMessage, err.body);
      return boomify(new Error(err.body), {
        statusCode: err.response.statusCode
      });
    } else if (err && err.isJoi && err.name === 'ValidationError') {
      console.log('[validation error]', err.details);
      return badRequest(err.details.map(detail => `${detail.path.join('.')}: ${detail.message}`).join('; '));
    } else {
      console.log('[internal error]', JSON.stringify(err, null, 2));
      return badImplementation(err);
    }
  }
}

module.exports = Http;
