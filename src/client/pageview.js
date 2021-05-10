const uv = require('./uv')()

module.exports = function onSecondPageView (cb, runAcrossViews) {
  const viewRegex = /^([^.]+\.)?[a-z]{2}View$/
  waitFor(
    () => window.__qubit.uv,
    50,
    () => {
      uv.once(viewRegex, () => {
        uv.on(viewRegex, () => {
          if (!runAcrossViews()) cb()
        })
      }).replay()
    }
  )
}

function waitFor (test, ms, cb) {
  if (test()) return cb()
  setTimeout(() => waitFor(test, ms, cb), ms)
}
