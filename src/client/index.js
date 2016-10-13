/* globals __VARIATIONJS__, __VARIATIONCSS__ */
var amd = require('./amd')
var engine = require('./engine')
var options = require('./options')
var key = __VARIATIONCSS__.replace(/\.css$/, '')
var opts = options(require('package.json'), key)

amd(init)

function init () {
  engine(opts, globalFn, triggerFn, variationFn)
}

function globalFn () {
  require('global')
}

function triggerFn (opts, cb) {
  return require('triggers')(opts, cb)
}

function variationFn (opts) {
  require(__VARIATIONCSS__)
  return require(__VARIATIONJS__)(opts)
}
