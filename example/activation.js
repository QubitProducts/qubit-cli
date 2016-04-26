module.exports = function activation (options, cb) {
  var shouldActivate = window.location.href.includes('activate')
  console.log('running activate.js ...should activate: ', shouldActivate)
  return cb(shouldActivate)
}
