module.exports = function withMetrics (experience, extra) {
  let meta = {
    xp: Object.assign({
      pushes: 0,
      lastPush: new Date()
    }, extra)
  }
  if (experience.meta) meta = JSON.parse(experience.meta)
  meta.xp.pushes++
  meta.xp.lastPush = new Date()
  meta = JSON.stringify(meta)
  return Object.assign({}, experience, { meta: meta })
}
