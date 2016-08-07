exports.setUnsetState = function(action) {
  return function(req, res) {
    var route = req.body.route;
    var state = Libs.state.getAll();

    var s = action === 'set' ? req.body.state : 200;

    if (_.get(state, route)) {
      Libs.state.set(route, req.body.verb, s);
    }

    res.send({status: 'ok'});
  };
};
