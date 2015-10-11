var path = require('path')

var test = require('tape')

var dir = require('../')

test('streams files and dirs recursively', function (t) {
  t.plan(1)

  var stream = dir()
  var output = []

  stream.on('data', function (data) {
    output.push(path.relative(__dirname, data.toString()))
  })

  stream.on('end', function () {
    t.deepEqual([
      'dir/.test',
      'dir/blah',
      'dir/dodo.txt',
      'dir2/bleh',
      'dir2/subdir',
      'dir2/subdir/weeee'
    ], output)
  })

  stream.write(path.join(__dirname, 'dir'))
  stream.write(path.join(__dirname, 'dir2'))
})

test('streams files only if option set', function (t) {
  t.plan(1)

  var stream = dir({onlyFiles: true})
  var output = []

  stream.on('data', function (data) {
    output.push(path.relative(__dirname, data.toString()))
  })

  stream.on('end', function () {
    t.deepEqual([
      'dir/.test',
      'dir/blah',
      'dir/dodo.txt',
      'dir2/bleh',
      'dir2/subdir/weeee'
    ], output)
  })

  stream.write(path.join(__dirname, 'dir'))
  stream.write(path.join(__dirname, 'dir2'))
})

test('does not recurse if option set', function (t) {
  t.plan(1)

  var stream = dir({noRecurse: true})
  var output = []

  stream.on('data', function (data) {
    output.push(path.relative(__dirname, data.toString()))
  })

  stream.on('end', function () {
    t.deepEqual([
      'dir/.test',
      'dir/blah',
      'dir/dodo.txt',
      'dir2/bleh',
      'dir2/subdir'
    ], output)
  })

  stream.write(path.join(__dirname, 'dir'))
  stream.write(path.join(__dirname, 'dir2'))
})

test('can ignore extensions', function (t) {
  t.plan(1)

  var stream = dir({ignoreExtensions: ['txt']})
  var output = []

  stream.on('data', function (data) {
    output.push(path.relative(__dirname, data.toString()))
  })

  stream.on('end', function () {
    t.deepEqual([
      'dir/.test',
      'dir/blah',
      'dir2/bleh',
      'dir2/subdir',
      'dir2/subdir/weeee'
    ], output)
  })

  stream.write(path.join(__dirname, 'dir'))
  stream.write(path.join(__dirname, 'dir2'))
})

test('can ignore dirs', function (t) {
  t.plan(1)

  var stream = dir({ignore: ['dir2']})
  var output = []

  stream.on('data', function (data) {
    output.push(path.relative(__dirname, data.toString()))
  })

  stream.on('end', function () {
    t.deepEqual([
      'dir/.test',
      'dir/blah',
      'dir/dodo.txt'
    ], output)
  })

  stream.write(path.join(__dirname, 'dir'))
  stream.write(path.join(__dirname, 'dir2'))
})
