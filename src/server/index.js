require('./app/utils');
require('./app/libs');
global._ = require('lodash');

var app = require('./app');

function start(cb) {
  Libs.parseJsonFilesToRoutes(Libs.options.get(), function(filesRoutes) {
    app.mount({filesRoutes: filesRoutes}, cb);
  });
}

module.exports = function SerialMocker(options) {
  Libs.options.init(options);

  return {
    start: start,
    state: Libs.state,
    app: app.self
  };
};
