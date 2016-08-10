# Stateful API mock server

[![Build Status](https://travis-ci.org/loveindent/stateful-api-mock-server.svg?branch=master)](https://travis-ci.org/loveindent/stateful-api-mock-server)
![Build Status](https://david-dm.org/loveindent/stateful-api-mock-server.svg)
[![codecov](https://codecov.io/gh/loveindent/stateful-api-mock-server/branch/master/graph/badge.svg)](https://codecov.io/gh/loveindent/stateful-api-mock-server)

Yet another API mock server. Why? Because it has to be simple and I didn't find a simple one in my case (independent api) based on directory file. It's mostly useful if your api use another api.

Just put a js/json file into a directory, start your server from your mocha/karma/etc and use the simple API to create your test cases.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Stateful API mock server](#stateful-api-mock-server)
- [Features](#features)
- [How to use](#how-to-use)
	- [In your tests file](#in-your-tests-file)
	- [Endpoints to File directory](#endpoints-to-file-directory)
	- [Use default case](#use-default-case)
	- [Change response state](#change-response-state)
- [API](#api)
	- [Constructor API](#constructor-api)
	- [State API](#state-api)
		- [Set `.set(Path<String>, Verb<String>, State<Number|String>)`](#set-setpathstring-verbstring-statenumberstring)
		- [Get `.get(Path<String>, Verb<String>)`](#get-getpathstring-verbstring)
		- [Get All `.getAll()`](#get-all-getall)
		- [Reset `.reset(Path<String>, Verb<String>)`](#reset-resetpathstring-verbstring)
		- [Reset All `.resetAll()`](#reset-all-resetall)
- [Debug](#debug)
- [TODO](#todo)

<!-- /TOC -->

# Features
- Independent mock server
- Totally stateful to facilitate unit tests
- Easy to use state API base on route paths

# How to use

## In your tests file

```js
var ApiMockServer = require('stateful-api-mock-server');

var api = new ApiMockServer([options<object>]);

api.start(function(){
  // write your tests case here
});
```
or with mocha
```js
var ApiMockServer = require('stateful-api-mock-server');

var api = new ApiMockServer([options<object>]);

describe('[API]', function() {
  before(function(done) {
    return api.start(function() {
      done();
    });
  });

  it('should do something', function() {
    //...
  });
});
```

## Endpoints to File directory

```shell
tests/api-mocks/
  L users/
     L get.json     # 200 GET /users response
     L get-404.json # 404 GET /users response
     L :id/
        L get.json  # 200 GET /users/:id response
        L post.json # 200 POST /users/:id response
  L cars/
     L get.json     # 200 GET /cars response
     L get-404.json # 404 GET /cars response
```

## Use default case
It's possible to define common response in a `_defaults` directory to avoid file duplication, like 404.

```shell
tests/api-mocks/
  L _defaults
     L get-404.json # 404 GET default response
  L users/
     L get.json     # 200 GET /users response
     L :id/
        L get.json  # 200 GET /users/:id response
        L post.json # 200 POST /users/:id response
  L cars/
     L get.json     # 200 GET /cars response
```

## Change response state
Imagine this test case suite:

```js
describe('api', function() {
  it('should respond with a 200', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
})
```

Now you want to test the 404 case
```js
describe('api', function() {
  it('should respond with a 404', function(done) {
    api.state.set('/users', 'GET', 404);

    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
})
```

> <b>/!\ Important!</b><br/>
> If you set a state to unknown construct file (like GET 403 and ./get-403 and /\_defaults/get-403 does not exist) it will return 503 and log an error in your terminal


Finally you can reset all
```js
describe('api', function() {
  ...

  afterEach(function() {
    api.state.resetAll();
  });
})
```

# API

## Constructor API
Default values:
```js
var api = new ApiMockServer({
  port: 7000, // Port to launch mocked api
  mockDir: 'tests/api-mocks', // Relative path to your mocks
});
```

## State API

### Set `.set(Path<String>, Verb<String>, State<Number|String>)`
Set a route to demanded state and set status response if State is a number.
```js
// Return get-404.[ext] file and set
api.state.set('/users/:id', 'GET', 404);

// Return get-another.[ext] file and set status to 200
api.state.set('/users/:id', 'GET', 'another');
```

### Get `.get(Path<String>, Verb<String>)`
Get a route state
```js
api.state.get('/users/:id', 'GET');
```

### Get All `.getAll()`
Get all route states
```js
api.state.getAll();
```

### Reset `.reset(Path<String>, Verb<String>)`
Reset a state to 200
```js
api.state.reset('/users/:id', 'GET');
```

### Reset All `.resetAll()`
Reset all routes to 200
```js
api.state.resetAll();
```

# Debug

To debug you can filter on this domain: `stateful-api-mock-server`

For example
```shell
DEBUG=stateful-api-mock-server:* npm test
```

# TODO

- [ ] Remove ext option
