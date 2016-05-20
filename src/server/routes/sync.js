var url = require('urlite')
var chalk = require('chalk')
var events = require('../lib/utils/events')
var confirm = require('../lib/utils/confirm')
var fetchCode = require('../lib/code/fetch')
var readCode = require('../lib/code/read')
var updateCode = require('../lib/code/update')
var scaffold = require('../lib/code/scaffold')
var log = require('../lib/utils/log')
var error = require('../lib/utils/error')
var synced

module.exports = function syncMode (req, res, next) {
  if (synced) return
  synced = true
  if (!req.body.url || !req.body.value) return nope(res)
  var ids = req.body.url.match(/\d+/g).map(Number)
  if (ids.length < 3) return nope(res)
  var uri = url.parse(req.body.url)
  var data = {
    domain: uri.protocol + '//' + uri.hostname,
    propertyId: ids[0],
    experimentId: ids[1],
    masterId: ids[2],
    auth: req.body.value
  }

  return fetchCode(data)
    .then(requestSync)
    .then(() => res.json({ message: 'ok' }), console.error)

  function requestSync (codes) {
    var msg = `You recently navigated to ${chalk.green.bold(req.body.url)}
Would you like ${chalk.green.bold('xp')} to try to connect to this experiment? ${chalk.green.bold('(y/n)')}`
    return confirm(msg).then((result) => {
      if (result) return sync(codes)
      synced = false
    })
  }

  function sync (codes) {
    return scaffold(process.cwd(), codes, true, log).then(watch).catch(error)
  }

  function watch () {
    log('watching for changes')
    events.on('rebuild', () => {
      log('syncing...')
      readCode(process.cwd()).then((codes) => updateCode(data, codes))
        .then(() => {
          process.stdout.moveCursor(0, -1)
          process.stdout.clearScreenDown()
          log(`synced!`)
        }).catch(error)
    })
  }
}

function nope (res, msg) {
  return res.json({ message: 'not ready for this jelly' })
}
