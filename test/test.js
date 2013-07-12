var dir = require('../index.js'),
    assert = require('assert'),
    stream = require('stream'),
    Readable = stream.Readable,
    Writable = stream.Writable,
    rs = Readable(),
    a = Writable({ decodeStrings: false }),
    output = [];

a._write = function (file, enc, next) {
  output.push(file);
  next();
};

a.end = function () {
  console.log(output);
};

rs._read = function () {
  rs.push(process.cwd() + '/dir');
  rs.push(process.cwd() + '/dir2');
  rs.push(null);
};

rs.pipe(dir()).pipe(process.stdout);

