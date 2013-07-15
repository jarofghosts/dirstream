var dir = require('../index.js'),
    assert = require('assert'),
    stream = require('stream'),
    Readable = stream.Readable,
    Writable = stream.Writable,
    rs = Readable(),
    a = Writable({ decodeStrings: false }),
    output = [];

function finish() {
  assert.ok(output[0].match(/dir\/.test$/));
  assert.ok(output[1].match(/dir\/blah$/));
  assert.ok(output[2].match(/dir\/dodo.txt$/));
}

a._write = function (file, enc, next) {
  output.push(file);
  if (output.length < 3) {
    next();
  } else {
    finish();
  }
};

rs._read = function () {
  rs.push(__dirname + '/dir');
  rs.push(__dirname + '/dir2');
  rs.push(null);
};

rs.pipe(dir({ ignore: ['dir2'] })).pipe(a);

