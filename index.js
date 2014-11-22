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
    if(!ls) start(arr.shift())
  }

  function start(dir) {
    ls = lsstream(dir)

    ls.on('data', processDir)
      .on('end', nextDir)
      .on('error', function(err) {
        stream.emit('error', err)
      })

    function processDir(data) {
      var dirs

      if(options.noRecurse) data.ignore()

      if(!data.stat || options.onlyFiles && data.stat.isDirectory()) return
      if(options.ignoreExtensions && options.ignoreExtensions.indexOf(
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

  function nextDir() {
    if(!arr.length) return stream.queue(null)

    start(arr.shift())
  }
}
