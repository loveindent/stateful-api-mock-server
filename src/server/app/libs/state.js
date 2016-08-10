var debug = require('debug')('stateful-api-mock-server:state');
var state = {};

function initState(route, verb) {
  if (!state[route]) {
    state[route] = {};
  }
  state[route][_.upperCase(verb)] = 200;
  debug('Init state ' + _.upperCase(verb) + ' to 200 for ' + route);
}

function resetState(route, verb) {
  if (arguments.length !== 2) {
    Utils.log('missing arguments');

    return;
  }
  state[route][_.upperCase(verb)] = 200;
  debug('State: %s %s now respond with %s', _.upperCase(verb), route, 200);
}

function resetAllState() {
  _.forIn(state, function(route, routeKey) {
    _.forEach(route, function(verb, verbKey) {
      state[routeKey][_.upperCase(verbKey)] = 200;
    });
  });
  debug('All states reset');
}

function setState(route, verb, s) {
  if (arguments.length !== 3) {
    Utils.log('missing arguments');

    return;
  }
  state[route][_.upperCase(verb)] = s;
  debug('State: %s %s now respond with %s', verb, route, s);
}

function getState(route, verb) {
  return state[route][_.upperCase(verb)];
}

function getAllState() {
  return state;
}

function __deleteAllState() {
  state = {};
}

module.exports = {
  _init: initState,
  get: getState,
  getAll: getAllState,
  set: setState,
  reset: resetState,
  resetAll: resetAllState,

  // Testing method
  __deleteAll: __deleteAllState
};
