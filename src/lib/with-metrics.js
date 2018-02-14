const pkg = require('../../package.json')

module.exports = function withMetrics (experience, extra) {
  let meta = experience.meta ? JSON.parse(experience.meta) : {}
  meta.xp = Object.assign({
    pushes: 0,
    version: pkg.version
  }, meta.xp, extra)
  meta.xp.pushes++
  meta.xp.lastPush = new Date()
  meta.xp.version = pkg.version
  return Object.assign({}, experience, { meta })
}
