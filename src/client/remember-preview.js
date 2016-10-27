module.exports = function rememberPreview (minutes, additionalVariations, cookieDomain) {
  if (additionalVariations && additionalVariations.length) {
    minutes = minutes || 15
    var variations = window.encodeURIComponent('[' + additionalVariations.join(',') + ']')
    var date = new Date()
    var domain = cookieDomain ? ' domain=' + cookieDomain + ';' : ''
    date.setTime(date.getTime() + (minutes * 60 * 1000))
    document.cookie = 'smartserve_preview=true; expires=' + date.toGMTString() + '; path=/;' + domain
    document.cookie = 'etcForceCreative=' + variations + '; expires=' + date.toUTCString() + '; path=/;' + domain
  }
}
