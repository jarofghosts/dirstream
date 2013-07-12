var through = require('through'),
    lsstream = require('ls-stream'),
    ls = null;

module.exports = dirstream;

function dirstream() {

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

