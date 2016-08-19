var routes = require('./routes');
var notFoundHandler = require('./middlewares/notFoundJson');
var errorHandler = require('api-error-handler');
var bodyParser = require('body-parser');
var express = require('express');
var debug = require('debug')('stateful-api-mock-server:app');

var server;

function mount(params, cb) {
  debug('mounting app');

  var app = express();

  app.use(bodyParser.json());

  app.use(routes(params));

  app.use(notFoundHandler());
  app.use(errorHandler());

  server = app.listen(Libs.options.get().port, function() {
    debug('API Mock server started on port ' + Libs.options.get().port);

    if (_.isFunction(cb)) {
      cb();
    }
  });
}

function unmount(cb) {
  debug('unmounting app');
  server.close(cb);
}

module.exports = {
  mount: mount,
  unmount: unmount
};
