var path = require('path')

var lsstream = require('ls-stream')
  , through = require('through')

module.exports = dirstream

function dirstream(_options) {
  var stream = through(write, noop)
    , ls = null
    , arr = []

  options = _options || {}

  return stream

  function write(buf) {
    arr.push(('' + buf).trim())
    if(!ls) do_dir(arr.shift())
  }

  function do_dir(dir) {
    ls = lsstream(dir)

    ls.on('data', process_dir)
      .on('end', next_dir)
      .on('error', noop)

    function process_dir(data) {
      if(options.noRecurse) data.ignore()

      if(!data.stat || (options.ignoreExtensions &&
        (options.ignoreExtensions.indexOf(
          path.extname(data.path).slice(1)) !== -1)) ||
      (options.onlyFiles && data.stat.isDirectory())) return
      // take that, readability

      if(options.ignore) {
        if(options.ignore.indexOf(data.path) !== -1 ||
          options.ignore.indexOf(path.dirname(data.path)) !== -1) return

        var dirs = data.path.split(path.sep)

        for(var i = 0, l = dirs.length; i < l; ++i) {
          if(options.ignore.indexOf(dirs[i]) !== -1) return
        }
      }

      stream.queue(data.path)
    }

    function next_dir() {
      if(!arr.length) return stream.queue(null)
      do_dir(arr.shift())
    }
  }
}

function noop(){}
