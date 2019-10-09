const Promise = require('sync-p/extra')
const _ = require('slapdash')
const cm = require('cookieman')
const now = require('now-plus')
const HOOK = '__qubit.cli.pre'

servePre()

function servePre () {
  if (!cm.val('qb_pre')) {
    cm.set('qb_pre', 1, {
      path: '/', expires: now.plus(15, 'minutes')
    })
    return window.location.reload()
  }
  var pre = _.get(window, HOOK)
  if (!pre) {
    pre = Promise.defer()
    _.set(window, HOOK, pre)
  }
  pre.resolve(require('pre'))
}
