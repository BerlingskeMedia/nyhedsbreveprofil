/*jshint node: true */
'use strict';

const Boom = require('boom');

module.exports.responseHandler = function (callback) {
  return function (res) {
    var data = '';
    var err = null;

    //<TODO> remove
    console.log('Server replied in some way');
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', function(d) {
      data = data + d;
    });
    res.on('end', function () {
      try {
        if (data.length > 0){
          data = JSON.parse(data);
        }
      } catch (ex) {
        console.error('JSON parse error on: ', data);
        throw Boom.boomify(ex);
      }
      if (data.statusCode > 300) {
        err = Boom.boomify(new Error(data.error.concat(' ', data.message)),{statusCode: data.statusCode});
      }

      callback(err, data);
    });
  };
}
