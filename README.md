# dir-stream

[![Build Status](http://img.shields.io/travis/jarofghosts/dirstream.svg?style=flat)](https://travis-ci.org/jarofghosts/dirstream)
[![npm install](http://img.shields.io/npm/dm/dir-stream.svg?style=flat)](https://www.npmjs.org/package/dir-stream)

given a stream of directory names, will output a stream of all contents of that
directory recursively and queued in order of receipt.

## options

optionally, you can pass a configuration object to the function with options:

```js
{
    ignoreExtensions: ['exe'] // don't stream filenames with extensions listed
  , onlyFiles: false // don't stream dirs
  , noRecurse: false // don't recurse into dirs
}
```

## license

MIT
