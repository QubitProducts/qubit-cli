/* globals chrome */
const NAMESPACE = 'xp-cli'
const log = console.log.bind(console)
var injected = false

chrome.storage.onChanged.addListener(xp)
xp()

function xp () {
  chrome.storage.local.get(NAMESPACE, function (obj) {
    var state = obj[NAMESPACE]
    if (!state.disabled) {
      if (isEditor()) {
        connect()
      } else if (injected === false) {
        inject()
        injected = true
      }
    }
  })
}

function connect () {
  console.log('Attempting to sync with xp')
  chrome.runtime.sendMessage({
    xp: true,
    url: window.location.href
  }, log)
}

function inject () {
  var script = document.createElement('script')
  script.src = 'https://localhost:1234/bundle.js'
  document.body.appendChild(script)
}

function isEditor () {
  var host = /^(localhost:3000|staging\-dashboard\.qubitproducts\.com|app\.qubit\.com)$/
  var path = /^\/p\/\d+\/experiences\/\d+\/editor\?vid=\d+/
  return host.test(window.location.host) && path.test(window.location.pathname + window.location.search)
}
