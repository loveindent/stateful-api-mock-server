var path = require('path');
var defaultOptions = require('config').get('defaultOptions');
var _options = {};

function init(options) {
  _.defaults(_options, options, defaultOptions);
  _options.absoluteMockDir = path.join(process.cwd(), _options.mockDir);
  _options.defaultMockDir = path.join(_options.mockDir, '_defaults');
  _options.absoluteDefaultMockDir = path.join(_options.absoluteMockDir, '_defaults');
}

function get() {
  return _options;
}

module.exports = {
  init: init,
  get: get
};
