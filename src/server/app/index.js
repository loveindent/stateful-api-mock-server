var routes = require('./routes');
var notFoundHandler = require('./middlewares/notFoundJson');
var errorHandler = require('api-error-handler');
var bodyParser = require('body-parser');
var express = require('express');
var debug = require('debug')('api-json-mocker:app');

var app = express();

var mount = function appStart(params, cb) {
  debug('mounting app');

  app.use(bodyParser.json());

  app.use(routes(params));

  app.use(notFoundHandler());
  app.use(errorHandler());

  app.listen(Libs.options.get().port, function() {
    debug('API Mock server started on port ' + Libs.options.get().port);

    if (_.isFunction(cb)) {
      cb();
    }
  });
};

module.exports = {
  mount: mount,
  self: app
};
