var dir = require('../index.js'),
    assert = require('assert'),
    stream = require('stream'),
    Readable = stream.Readable,
    Writable = stream.Writable,
    rs = Readable(),
    a = Writable({ decodeStrings: false }),
    output = [],
    go = true;

a._write = function (file, enc, next) {
  output.push(file);
  next();
};

a.end = function () {
  console.log(output);
};

rs._read = function () {
  if (go) {
    rs.push(process.cwd() + 'dir/');
    go = false;
  } else {
    rs.push(null);
  }
}

rs.pipe(dir()).pipe(a);

//rs.push('./dir/');
//rs.push(null);
