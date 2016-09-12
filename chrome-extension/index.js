/* globals chrome */
const log = console.log.bind(console)
let enabled = false

chrome.storage.onChanged.addListener(function () {
  chrome.runtime.sendMessage({ command: 'getState' }, function (state) {
    if (!enabled && state.enabled) return xp(state)
    if (enabled && !state.enabled) return window.location.reload()
  })
})

chrome.runtime.sendMessage({ command: 'getState' }, xp)

function xp (state) {
  if (state.enabled) {
    if (isEditor()) return connect()
    if (!enabled) enabled = true
    appendScript()
  }
}

function connect () {
  console.log('Attempting to connect with xp')
  chrome.runtime.sendMessage({
    command: 'connect',
    url: window.location.href
  }, log)
}

function appendScript () {
  var script = document.createElement('script')
  script.src = 'https://localhost:41337/bundle.js'
  document.body.appendChild(script)
}

function isEditor () {
  var pattern = /^https?:\/\/(app\.qubit\.com|staging\-dashboard\.qubitproducts\.com|localhost:3000)\/p\/\d+\/experiences\/\d+/
  return pattern.test(window.location.href)
}
