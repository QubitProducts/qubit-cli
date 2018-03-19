const updateNotifier = require('update-notifier')
const config = require('../../config')
const pkg = require('../../package.json')

module.exports = function getUpdate () {
  const update = updateNotifier({
    pkg,
    updateCheckInterval: config.updateCheckInterval
  })
  return update
}
