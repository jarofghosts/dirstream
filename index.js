var through = require('through'),
    lsstream = require('ls-stream'),
    path = require('path'),
    ls = null

module.exports = dirstream

function dirstream(options) {
  var arr = [],
      tr = through(write, noop)

  options = options || {}

  return tr

  function write(buf) {
    arr.push(buf.toString().trim())
    if (!ls) processDir(arr.shift())
  }

  function processDir(dir) {
    ls = lsstream(dir)

    ls.on('data', function (data) {
      if (!data.stat) return

      if (options.ignoreExtensions &&
        (options.ignoreExtensions.indexOf(
          path.extname(data.path).slice(1)) !== -1)) return

      if (options.onlyFiles && data.stat.isDirectory()) return

      if (options.noRecurse) {
        data.ignore()
      }

      if (options.ignore &&
        (options.ignore.indexOf(data.path) !== -1 ||
          options.ignore.indexOf(path.dirname(data.path)) !== -1)) return
      if (options.ignore) {
        var dirs = data.path.split(path.sep),
            i = 0,
            l = dirs.length
        for (; i < l; ++i) {
          if (options.ignore.indexOf(dirs[i]) !== -1) return
        }
      }

      tr.queue(data.path)
    })

    ls.on('end', function () {
      if (!arr.length) return tr.queue(null)
      processDir(arr.shift())
    })

    ls.on('error', noop)
  }
}

function noop(){}
