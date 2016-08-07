module.exports = function initRoutes(params) {
  var router = require('express').Router();

  router.use(require('./setState'));
  router.use(require('./dynamicRoutes')(params.filesRoutes));

  return router;
};
