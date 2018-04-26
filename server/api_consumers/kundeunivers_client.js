
const Http = require('../lib/http');

module.exports.fetchAllData = (gigyaUid) => {
  return Http.get(`${process.env.KUNDEUNIVERS_URL}/my/account/${gigyaUid}/orders.json?extended=1&transactions=1`);
};
