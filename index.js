var path = require('path')

var lsstream = require('ls-stream')
  , through = require('through')

module.exports = dirstream

function dirstream(_options) {
  var stream = through(write, end)
    , arr = []
    , options
    , ls

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
      .on('error', function(err) {
        stream.emit('error', err)
      })

    function process_dir(data) {
      var dirs

      if(options.noRecurse) data.ignore()

      if(!data.stat || options.onlyFiles && data.stat.isDirectory()) return
      if(options.ignoreExtensions &&
         options.ignoreExtensions.indexOf(
             path.extname(data.path).slice(1)
         ) > -1) return

      if(options.ignore && (options.ignore.indexOf(data.path) !== -1 ||
         options.ignore.indexOf(path.dirname(data.path)) !== -1)) return

        dirs = data.path.split(path.sep)

        for(var i = 0, l = dirs.length; i < l; ++i) {
          if(options.ignore && options.ignore.indexOf(dirs[i]) !== -1) return
        }

        stream.queue(data.path)
      }
    }

  function end() {
    if(!ls) stream.queue(null)
  }

  function next_dir() {
    if(!arr.length) return stream.queue(null)

    do_dir(arr.shift())
  }
}
