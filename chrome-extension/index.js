/* globals chrome */
var log = console.log.bind(console)
var injected = false

runContent()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  setXpCliOn(request.xpCliOn)
  runContent()
})

function runContent () {
  if (isEditor()) {
    connect()
  } else if (getXpCliOn() === true && injected === false) {
    inject()
    injected = true
  }
}

function setXpCliOn (val) {
  window.localStorage.xpCliOn = JSON.stringify(val)
}

function getXpCliOn () {
  var val = window.localStorage.xpCliOn || 'true'
  return JSON.parse(val)
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
