[![Build Status](https://travis-ci.org/loveindent/serial-api-mocker.svg?branch=master)](https://travis-ci.org/loveindent/serial-api-mocker)
![Build Status](https://david-dm.org/loveindent/serial-api-mocker.svg)
[![codecov](https://codecov.io/gh/loveindent/serial-api-mocker/branch/master/graph/badge.svg)](https://codecov.io/gh/loveindent/serial-api-mocker)

# Serial API Mocker
Another yet api mock server. Why? Because it has to be simple and I didn't find a simple one for my case (independent api) based on directory file. It's almost useful if your api use another api.

Just put a js/json file into a directory, start your server from your mocha/karma/etc and use the simple API to create your tests cases.

# Feature
- Mock server served from js/json file where ever you want
- Easy to use api base on route paths

# How to use

## In your tests file

```js
var SerialApiMocker = require('serial-api-mocker');

var api = new SerialApiMocker([options]);

api.start(function(){
  // write your tests case here
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

It's possible to define common response in a `_default` directory.

```shell
tests/api-mocks/
  L _default
     L get-404.json # 404 GET default response
  L users/
     L get.json     # 200 GET /users response
     L :id/
        L get.json  # 200 GET /users/:id response
        L post.json # 200 POST /users/:id response
  L cars/
     L get.json     # 200 GET /cars response
```

## Change response stats
Imagine this tests cases suite:

```js
describe('api', function() {
  it('should respond with a use', function(done) {
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
  it('should respond with a use', function(done) {
    api.state.set('/users', 'GET', 404);

    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
})
```

Finally you can reset all
```js
describe('api', function() {
  ...

  afterEach(function() {
    api.state.reset();
  });
})
```

# API

## Constructor API

```js
var api = new SerialApiMocker({
  port: 7000, // Port to launch mocked api
  mockDir: 'tests/api-mocks', // Relative path to your mocks
});
```

## State API

### Set
Set a route to demanded status
```js
api.state.set('/users/:id', 'GET', 404);
```

### Get
Get a route status
```js
api.state.get('/users/:id', 'GET');
```

### Reset
Reset to 200 all routes
```js
api.state.reset();
```

# TODO

- [ ] Remove ext option
