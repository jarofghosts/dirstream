# dir-stream

[![Build Status](http://img.shields.io/travis/jarofghosts/dirstream.svg?style=flat)](https://travis-ci.org/jarofghosts/dirstream)
[![npm install](http://img.shields.io/npm/dm/dir-stream.svg?style=flat)](https://www.npmjs.org/package/dir-stream)
[![npm version](https://img.shields.io/npm/v/dir-stream.svg?style=flat-square)](https://www.npmjs.org/package/dir-stream)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![License](https://img.shields.io/npm/l/dir-stream.svg?style=flat-square)](https://github.com/jarofghosts/dir-stream/blob/master/LICENSE)

given a stream of directory names, will output a stream of all contents of that
directory recursively and queued in order of receipt.

## example

```javascript
var dirstream = require('dir-stream')

dirstream.on('data', function (filename) {
  // `filename` is a file or dir within `__dirname`
})

dirstream.write(__dirname)
```

## options

optionally, you can pass a configuration object to the function with options:

```javascript
{
  ignoreExtensions: ['exe'], // don't stream filenames with extensions listed
  onlyFiles: false, // don't stream dirs
  noRecurse: false // don't recurse into dirs
}
```

## license

MIT
