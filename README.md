dir-stream
====

[![Build Status](https://travis-ci.org/jarofghosts/dirstream.png?branch=master)](https://travis-ci.org/jarofghosts/dirstream)

given a stream of directory names, will output a stream of all contents of that directory recursively and queued in order of receipt.

## options

optionally, you can pass a configuration object to the function with options:
```js
{
  ignoreExtensions: ['exe'], // don't stream filenames with extensions listed
  onlyFiles: false,
  noRecurse: false
}
```

## license

MIT
