const pkg = require('../../package.json')

module.exports = function withMetrics (experience, extra) {
  let meta = experience.meta ? JSON.parse(experience.meta) : {}
  meta.cli = {
    pushes: 0,
    ...meta.xp,
    ...meta.cli,
    ...extra,
    lastPush: new Date(),
    version: pkg.version
  }
  meta.cli.pushes++
  return { ...experience, meta }
}
