// const BPC = require('../bpc_client');
const Http = require('../lib/http');

module.exports.fetchAllData = (gigyaUid) => {
  return Http.get(`${process.env.KUNDEUNIVERS_URL}/my/account/${gigyaUid}/orders.json?extended=1&transactions=1`, BPC.appTicket);
};

module.exports.fetchAllDataSimple = (gigyaUid) => {
  return Http.get(`${process.env.KUNDEUNIVERS_URL}/my/account/${gigyaUid}/orders.json`, BPC.appTicket);
};

module.exports.deleteAccount = gigyaUID => {
  return Http.delete(`${process.env.KUNDEUNIVERS_URL}/my/kundeunivers_user/${gigyaUID}`, BPC.appTicket);
};