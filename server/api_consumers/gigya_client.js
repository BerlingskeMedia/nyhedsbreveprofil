const Http = require('../lib/http');
const {badImplementation} = require('boom');

class Gigya {
  static deleteAccount(UID) {
    return Http.get(`${process.env.GIGYA_API_URL}/accounts.deleteAccount`, null, {
      UID,
      ApiKey: process.env.GIGYA_API_KEY,
      secret: process.env.GIGYA_API_SECRET
    }).then(response => {
      if (response.statusCode > 399) {
        return Promise.reject(response);
      }

      return response;
    });
  }

  static wrapError(response) {
    if (response && response.statusCode > 399) {
      console.log('[Gigya API error]', response.statusCode, response.errorDetails);
      return badImplementation();
    }

    return Http.wrapError(response);
  }
}

module.exports = Gigya;