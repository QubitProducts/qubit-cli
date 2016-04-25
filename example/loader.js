var activation = require('./activation')
activation({}, function (shouldActivate) {
  if (!shouldActivate) {
    console.log('activation returned false')
    return
  }
  require('./global')
  require('./variation.css')
  require('./index')({})
})
