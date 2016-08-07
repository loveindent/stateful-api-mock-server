var router = require('express').Router();
var m = require('./middlewares');

router.post('/set-state', m.setUnsetState('set'));
router.delete('/set-state', m.setUnsetState('unset'));

module.exports = router;
