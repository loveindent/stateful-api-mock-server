var request = require('supertest');
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

    it('GET should respond with global 500', function(done) {
      api.state.set('/users/:id', 'GET', 500);

      request(app)
        .get('/users/id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, globalGet500, done)
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
