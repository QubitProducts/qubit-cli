var _ = require('slapdash')

module.exports = function domain (domains, currentHost) {
  currentHost = currentHost || window.location.hostname

  var match = _.find(domains, function (domain) {
    var rDomain = regexify(domain)
    return rDomain.test(currentHost)
  })
  return match
}

function regexify (domain) {
  return new RegExp('(^|\\.)' + removeLeadingDot(domain)
    .replace(/\./g, '\\.') + '$')
}

function removeLeadingDot (domain) {
  return domain.replace(/^\./, '')
}
