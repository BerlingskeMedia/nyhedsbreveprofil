const {sign, decode} = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.authConfig = {
  key: JWT_SECRET,
  verifyOptions: {
    algorithms: ['HS256']
  },
  validateFunc: (token, request, h) => {
    return token && token.userTicket && token.userTicket.exp > Date.now();
  }
};

module.exports.generateToken = (userTicket, payload) => {
  return sign(Object.assign({userTicket}, payload), JWT_SECRET);
};

module.exports.decodeRequest = request => {
  return decode(request.headers.authorization, JWT_SECRET);
};