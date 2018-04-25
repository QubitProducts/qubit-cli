/* globals chrome */
const log = console.log.bind(console)
let enabled = false

if (isEditor()) {
  connect()
} else {
  chrome.storage.onChanged.addListener(function () {
    chrome.runtime.sendMessage({ command: 'getState' }, function (state) {
      if (!enabled && state.enabled) return runCli(state)
      if (enabled && !state.enabled) return window.location.reload()
    })
  })
  chrome.runtime.sendMessage({ command: 'getState' }, runCli)
}

function isEditor () {
  var pattern = /^https?:\/\/(app\.qubit\.com|staging-dashboard\.qubitproducts\.com|localhost:3000)\/p\/\d+\/experiences\/\d+/
  return pattern.test(window.location.href)
}

function connect () {
  chrome.runtime.sendMessage(
    { command: 'connect', url: window.location.href },
    log
  )
}

function runCli (state) {
  return new Promise(resolve => {
    if (document.body) resolve()
    document.addEventListener('DOMContentLoaded', resolve)
    window.addEventListener('load', resolve)
  }).then(() => {
    if (state.enabled) {
      if (!enabled) enabled = true
      appendScript()
    }
  })
}

function appendScript () {
  var script = document.createElement('script')
  script.src = 'https://localhost:41337/bundle.js'
  document.body.appendChild(script)
}
