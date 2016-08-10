var router = require('express').Router();
var path = require('path');
var debug = require('debug')('stateful-api-mock-server:app:routes:dynamicRoutes');

var constructRoutes = function(items) {
  var options = Libs.options.get();

  items.forEach(function(item) {
    Libs.state._init(item.route, item.verb);

    router[item.verb](item.route, function(req, res, next) { //eslint-disable-line no-unused-vars
      var s = Libs.state.get(item.route, item.verb);

      if (!_.isEmpty(req.params) && _.has(Libs.state.getAll(), req.path + '.' + _.upperCase(item.verb))) {
        return next('route');
      }

      debug(req.path + ' called. Current state is ' + s + '. Route is ' + req.route.path);

      if (s !== 200) {
        var json;
        var pathToRequire = path.join(item.dir, item.verb + '-' + s + item.ext);

        try {
          json = require(pathToRequire);
        }
        catch (err) {
          try {
            var defaultPathToRequire = path.join(options.absoluteDefaultMockDir, item.verb + '-' + s + options.ext);

            debug(pathToRequire + ' does not exist, fallbacked to: ' + defaultPathToRequire);
            json = require(defaultPathToRequire);
          }
          catch (err) {
            debug(err.name + ' ' + err.message);
            var requireError = err;

            json = {
              message: err.message,
              name: 'ApiMockServerError',
              type: err.type,
              arguments: err.arguments
            };
            s = 503;
          }
        }

        if (requireError) {
          requireError.name = 'ApiMockServerError';
          Utils.logError(requireError);
        }

        if (_.isNumber(s)) {
          res.status(s);
        }

        res.send(json);
      }
      else {
        res.send(require(item.file));
      }
    });
  });

  debug(Libs.state.getAll());

  return router;
};

module.exports = constructRoutes;
