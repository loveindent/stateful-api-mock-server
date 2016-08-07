var router = require('express').Router();
var path = require('path');
var debug = require('debug')('api-json-mocker:app:routes:dynamicRoutes');

var constructRoutes = function(items) {
  var options = Libs.options.get();

  items.forEach(function(item) {
    Libs.state._init(item.route, item.verb);

    router[item.verb](item.route, function(req, res, next) { //eslint-disable-line no-unused-vars
      var s = Libs.state.get(item.route, item.verb);

      if (s !== 200) {
        var json;
        var pathToRequire = path.join(item.dir, item.verb + '-' + s + item.ext);

        try {
          json = require(pathToRequire);
        }
        catch (err) {
          var defaultPathToRequire = path.join(options.absoluteDefaultMockDir, item.verb + '-' + s + options.ext);

          debug(pathToRequire + ' does not exist, fallbacked to: ' + defaultPathToRequire);
          json = require(defaultPathToRequire);
        }
        res.status(s).send(json);
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
