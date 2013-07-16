var through = require('through'),
    lsstream = require('ls-stream'),
    path = require('path'),
    ls = null;

module.exports = dirstream;

function dirstream(options) {

  options = options || {};

  var arr = [],
      tr = through(write, end);

  function write(buf) {
    arr.push(buf.toString().trim());
    if (!ls) {
      processDir(arr.shift());
    }
  }

  function processDir(dir) {

    ls = lsstream(dir);

    ls.on('data', function (data) {
      if (!data.stat) return;
      if (options.onlyFiles && data.stat.isDirectory()) return;
      if (options.noRecurse && path.dirname(data.path) != dir) return;
      if (options.ignore && (options.ignore.indexOf(data.path) !== -1 || options.ignore.indexOf(path.dirname(data.path)) !== -1)) return;
      tr.queue(data.path);
    });

    ls.on('end', function () {
      if (!arr.length) {
        ls = null;
      } else {
        processDir(arr.shift());
      }
    });

    ls.on('error', function () {
      // no-op currently
    });

  }

  function end() {
    if (!ls) {
      this.queue(null);
    }
  }

  return tr;
 
}

