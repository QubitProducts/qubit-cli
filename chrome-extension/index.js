/* globals chrome */
const NAMESPACE = 'xp-cli'
const log = console.log.bind(console)
let injected = false

chrome.storage.onChanged.addListener(xp)
xp(false)

function xp (refreshOnChange) {
  chrome.storage.local.get(NAMESPACE, function (obj) {
    var state = obj[NAMESPACE] || {}
    if (!state.disabled) {
      if (isEditor()) {
        connect()
      } else if (injected === false) {
        inject()
        injected = true
      }
    } else if (refreshOnChange) {
      window.location.reload()
    }
  })
}

function connect () {
  console.log('Attempting to connect with xp')
  chrome.runtime.sendMessage({
    xp: true,
    url: window.location.href
  }, log)
}

function inject () {
  var script = document.createElement('script')
  script.src = 'https://localhost:41337/bundle.js'
  document.body.appendChild(script)
}

function isEditor () {
  var pattern = /^https?:\/\/(app\.qubit\.com|staging\-dashboard\.qubitproducts\.com|localhost:3000)\/p\/\d+\/experiences\/\d+/
  return pattern.test(window.location.href)
}
