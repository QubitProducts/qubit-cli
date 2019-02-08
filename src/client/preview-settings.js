const _ = require('slapdash')
const now = require('now-plus')
const hashParser = require('urlite/lib/querystring')('#')
const yurl = require('urlite/extra')
const PREVIEW_KEYS = ['qb_opts', 'qb_experiences', 'qb_exclude', 'smartserve_preview']
let cm = require('cookieman')

module.exports = function previewSettings (meta, include, exclude) {
  const initialCookieVal = cm.val('qb_opts')
  cm.clearAll('qb_opts')
  const cookieOptions = getCookieOptions(meta.cookieDomain)
  const cookieVal = getPreviewCookie(meta, include, exclude)
  cm.set('qb_opts', cookieVal, cookieOptions)
  // if the current value is different we need to reload, as smartserve may already have fired
  const url = getUrl(location(), initialCookieVal && (initialCookieVal !== cookieVal))
  if (url) reload(url)
}

function getCookieOptions (cookieDomain) {
  return { path: '/', domain: cookieDomain, expires: now.plus(15, 'minutes') }
}

function getPreviewCookie (meta, include, exclude) {
  exclude = exclude || []
  const previewOptions = { preview: meta.isPreview, exclude: exclude.concat(meta.experienceId).sort() }
  if (include) previewOptions.experiences = include.sort()
  return encodeURIComponent(JSON.stringify(previewOptions))
}

function urlHasPreviewKeys (params) {
  params = Object.keys(params)
  return _.some(PREVIEW_KEYS, function (key) {
    return params.includes(key)
  })
}

function getUrl (location, mustReload) {
  const parsed = yurl.parse(location)
  if (parsed.hash) parsed.hash = hashParser.parse(parsed.hash)
  const params = { ...parsed.search, ...parsed.hash }
  if (urlHasPreviewKeys(params)) mustReload = true
  if (!mustReload) return
  if (parsed.search) parsed.search = omit(parsed.search, PREVIEW_KEYS)
  if (parsed.hash) parsed.hash = hashParser.format(omit(parsed.hash, PREVIEW_KEYS))
  return yurl.format(parsed)
}

function location () {
  return window.location.href
}

function reload (url) {
  const parsed = yurl.parse(url)
  if (parsed.hash) {
    window.location.hash = parsed.hash
  } else {
    if (window.history.pushState) {
      window.history.pushState('', '/', window.location.pathname)
    } else {
      window.location.hash = ''
    }
  }
  window.location.replace(url)
  window.location.reload()
}

function omit (obj, keys) {
  var result = {}
  for (let key in obj) {
    if (!keys.includes(key)) obj[key] = result[key]
  }
  return result
}
