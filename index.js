var path = require('path')

var lsstream = require('ls-stream')
var through = require('through2')

module.exports = dirstream

function dirstream (_options) {
  var options = _options || {}
  var stream = through(write)
  var queue = []
  var ignore = options.ignore || []
  var ignoreExtensions = options.ignoreExtensions || []

  var ls

  return stream

  function write (buf, _, next) {
    queue.push(buf.toString().trim())

    if (!ls) {
      start(queue.shift())
    }

    next()
  }

  function start (dir) {
    ls = lsstream(dir)

    ls.on('data', processDir)
      .on('end', nextDir)
      .on('error', function (err) {
        stream.emit('error', err)
      })

    function processDir (data) {
      var extension = path.extname(data.path).slice(1)
      var dirname = path.dirname(data.path)
      var dirs

      if (options.noRecurse) {
        data.ignore()
      }

      if (!data.stat || options.onlyFiles && data.stat.isDirectory()) {
        return
      }

      if (ignoreExtensions.indexOf(extension) > -1) {
        return
      }

      if (ignore.indexOf(data.path) !== -1 || ignore.indexOf(dirname) !== -1) {
        return
      }

      dirs = data.path.split(path.sep)

      for (var i = 0, l = dirs.length; i < l; ++i) {
        if (ignore.indexOf(dirs[i]) !== -1) {
          return
        }
      }

      stream.push(data.path)
    }

    function nextDir () {
      if (!queue.length) {
        return stream.push(null)
      }

      start(queue.shift())
    }
  }
}
