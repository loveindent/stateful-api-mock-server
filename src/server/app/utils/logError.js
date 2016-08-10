var log = require('./logger');

module.exports = function(error) {
  if (error.stack.length > 1000) {
    log('\n\n\033[31m' + error.stack.substring(0, 1000) + ' [...]\n\n'); //eslint-disable-line no-console
  }
  else {
    log('\n\n\033[31m' + error.stack + '\n\n'); //eslint-disable-line no-console
  }
};
