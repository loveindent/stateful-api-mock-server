var request = require('supertest');
var expect = require('chai').expect;
var SAM = require('../src/server');

var api = new SAM({
  port: 7000
});
var app = api.app;

var globalGet500 = require('./api-mocks/_defaults/get-500.json');
var globalGet404 = require('./api-mocks/_defaults/get-404.json');
var localPlayerGet404 = require('./api-mocks/users/:id/player/get-404.json');

describe('[API]', function() {
  before(function(done) {
    return api.start(function() {
      done();
    });
  });

  afterEach(function() {
    api.state.resetAll();
  });

  describe('global', function() {
    it('should return 404 if route does not exists', function(done) {
      request(app)
        .get('/unknowroute/:id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done)
      ;
    });

    it('should set state by api call', function(done) {
      api.state._init('/test-api-call', 'GET');
      request(app)
        .post('/set-state')
        .send({
          route: '/test-api-call',
          verb: 'GET',
          state: 404
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function() {
          expect(api.state.get('/test-api-call', 'get')).to.be.equal(404);
          done();
        })
      ;
    });

    it('should set state by api call', function(done) {
      api.state._init('/test-api-call', 'GET');
      api.state.set('/test-api-call', 'GET', 404);
      request(app)
        .delete('/set-state')
        .send({
          route: '/test-api-call',
          verb: 'GET'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function() {
          expect(api.state.get('/test-api-call', 'get')).to.be.equal(200);
          done();
        })
      ;
    });
  });

  describe('/users/:id', function() {
    it('GET should respond with 200', function(done) {
      request(app)
        .get('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
      ;
    });

    it('GET should respond with global 404', function(done) {
      api.state.set('/users/:id', 'GET', 404);

      request(app)
        .get('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, globalGet404, done)
      ;
    });

    it('GET should return 503 if ApiMockServer is on error', function(done) {
      api.state.set('/users/:id', 'GET', 403);

      // Mock log function
      Utils.logError = function() {};

      request(app)
        .get('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(503, done)
      ;
    });

    it('GET should respond with global 500', function(done) {
      api.state.set('/users/:id', 'GET', 500);

      request(app)
        .get('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, globalGet500, done)
      ;
    });

    it('GET should respond 200 with another mock', function(done) {
      api.state.set('/users/:id', 'GET', 'test');

      request(app)
        .get('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          _route: '/users/:id/get-test.json'
        }, done)
      ;
    });

    it('POST should respond with 200', function(done) {
      request(app)
        .post('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
      ;
    });
  });

  describe('/users/email', function() {
    it('should respond with 200', function(done) {
      request(app)
        .get('/users/email')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {what: 'get an email'}, done)
      ;
    });
  });

  describe('/users/id/player', function() {
    it('should respond with 200', function(done) {
      request(app)
        .get('/users/id/player')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
      ;
    });

    it('should respond with local 404', function(done) {
      api.state.set('/users/:id/player', 'GET', 404);

      request(app)
        .get('/users/id/player')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, localPlayerGet404, done)
      ;
    });
  });
});
