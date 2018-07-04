const request = require('request');
const {boomify, badImplementation, badRequest} = require('boom');

class Http {
  static get(url, credentials, params) {
    return Http.request('get', url, credentials, params);
  }

  static put(url, payload, credentials) {
    return Http.request('put', url, credentials, payload);
  }

  static delete(url, credentials) {
    return Http.request('delete', url, credentials);
  }

  static request(method, uri, credentials, payload = null) {
    return new Promise((fulfill, reject) => {
      request({
        uri,
        method,
        [method === 'get' ? 'qs' : 'json']: payload,
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

  static request_plain(options) {
    return new Promise((fulfill, reject) => {
      request(options, (err, response, body) => {
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
