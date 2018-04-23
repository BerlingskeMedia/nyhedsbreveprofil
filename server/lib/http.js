const request = require('request');
const BPC = require('../bpc_client');

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
          app: credentials.id
        } : null
      }, (err, response, body) => {
        if (err) {
          reject(err);
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
}

module.exports = Http;