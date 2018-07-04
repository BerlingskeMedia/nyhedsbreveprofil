const Http = require('../lib/http');
const {badImplementation} = require('boom');

class Gigya {
  static deleteAccount(UID) {
    const GIGYA_API_KEY = process.env.GIGYA_API_KEY;
    const GIGYA_API_USER = process.env.GIGYA_API_USER;
    const GIGYA_API_SECRET = process.env.GIGYA_API_SECRET;
    const url = `${process.env.GIGYA_API_URL}/accounts.deleteAccount`;

    return Http.request_plain(
      {
        url: url,
        qs: {
          apiKey: GIGYA_API_KEY,
          userKey: GIGYA_API_USER,
          secret: GIGYA_API_SECRET,
        },
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          UID: UID
        }
      }
    )
    .then(response => {
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