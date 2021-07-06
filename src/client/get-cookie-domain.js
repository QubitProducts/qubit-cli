const _ = require('slapdash')

module.exports = function domain (
  domains = [window.location.hostname],
  currentHost = window.location.hostname
) {
  const match = _.find(domains, function (domain) {
    const rDomain = regexify(domain)
    return rDomain.test(currentHost)
  })
  return match
}

function regexify (domain) {
  return new RegExp(
    '(^|\\.)' + removeLeadingDot(domain).replace(/\./g, '\\.') + '$'
  )
}

function removeLeadingDot (domain) {
  return domain.replace(/^\./, '')
}
