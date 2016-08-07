var fs = require('fs-extra');
var path = require('path');
var debug = require('debug')('api-json-mocker:app:libs:parseJsonFilesToRoutes');

var parseJsonFiles = function(options, cb) {
  var items = [];

  fs.walk(options.absoluteMockDir)
    .on('readable', function() {
      var item;

      while ((item = this.read())) {
        var p = item.path;
        var pp = path.parse(p);

        if (p.length && pp.ext && pp.name.indexOf('-') === -1) {
          var route = pp.dir.replace(options.absoluteMockDir, '');

          items.push({
            dir: pp.dir,
            ext: pp.ext,
            route: route,
            verb: _.lowerCase(pp.name),
            file: p
          });
          debug('Find ' + _.upperCase(pp.name) + ' for ' + route + ' (' + pp.ext + ')');
        }
      }
    })
    .on('end', function() {
      debug('find ' + items.length + 'file');
      cb(items);
    })
  ;
};

module.exports = parseJsonFiles;
