var expect = require('chai').expect;
var stateLib = require('./state');

describe('state', function() {
  afterEach(function() {
    stateLib.__deleteAll();
  });

  describe('_init', function() {
    it('should init a state entry', function() {
      stateLib._init('/truc', 'get');
      expect(stateLib.getAll()['/truc']).to.deep.equal({'GET': 200});
    });

    it('should init a seconde verb into an existing state', function() {
      stateLib._init('/truc', 'delete');
      stateLib._init('/truc', 'post');
      expect(stateLib.getAll()['/truc']).to.deep.equal({'DELETE': 200, 'POST': 200});
    });
  });

  describe('reset', function() {
    it('should reset to 200 a state', function() {
      stateLib._init('/truc', 'delete');
      stateLib.set('/truc', 'delete', 404);
      stateLib.reset('/truc', 'delete');
      expect(stateLib.getAll()['/truc']).to.deep.equal({'DELETE': 200});
    });

    it('should do nothing if missing arguments', function() {
      stateLib._init('/truc', 'delete');
      stateLib.set('/truc', 'delete', 404);
      stateLib.reset('/truc');
      expect(stateLib.getAll()['/truc']).to.deep.equal({'DELETE': 404});
    });
  });

  describe('set', function() {
    it('should set to 404 a state', function() {
      stateLib._init('/truc', 'delete');
      stateLib.set('/truc', 'delete', 404);
      expect(stateLib.getAll()['/truc']).to.deep.equal({'DELETE': 404});
    });

    it('should do nothing if missing arguments', function() {
      stateLib._init('/truc', 'delete');
      stateLib.set('/truc', 'delete');
      expect(stateLib.getAll()['/truc']).to.deep.equal({'DELETE': 200});
    });
  });
});
