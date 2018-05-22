const {sign, decode} = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.authConfig = {
  key: JWT_SECRET,
  verifyOptions: {
    algorithms: ['HS256']
  },
  validateFunc: (authTicket, request, callback) => {
    callback(null, authTicket && authTicket.exp > Date.now());
  }
};

module.exports.generateToken = userTicket => {
  return sign(userTicket, JWT_SECRET);
};

module.exports.decodeRequest = request => {
  return decode(request.headers.authorization, JWT_SECRET);
};