module.exports = function() {
  return function(req, res, next) {
    res.status(404).send({message: 'Not Found', messageCode: 'errors.notFound', status: 404, statusCode: 404});
  }
}
