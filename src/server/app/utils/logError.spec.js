var expect = require('chai').expect;
var sinon = require('sinon');
var mock = require('mock-require');
var f = sinon.spy();

mock('./logger', f);
var logError = require('./logError');

describe('logError', function() {
  after(function() {
    mock.stopAll();
  });

  it('should log with a truncated stack trace', function() {
    var err = new Error('test');

    logError(err);
    expect(f.called).to.be.true;
  });

  it('should log without a truncated stack trace', function() {
    var err = new Error('test');

    err.stack = 'anyway';

    logError(err);
    expect(f.called).to.be.true;
  });
});
