/* globals chrome fetch */
const CONNECT_ENDPOINT = 'https://localhost:41337/connect'
const NAMESPACE = 'xp-cli'
const ICONS = {
  on: 'icons/on48.png',
  off: 'icons/off48.png'
}

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let id = tabs.length && tabs[0].id
    if (id) {
      getState(id, (state) => setState(id, {
        enabled: !state.enabled
      }, render))
    }
  })
})

chrome.tabs.onRemoved.addListener((tabId) => {
  setState(tabId, {})
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'connect') {
    return fetch(CONNECT_ENDPOINT, {
      mode: 'cors',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url: request.url
      })
    })
    .then((response) => response.json().then(sendResponse))
    .catch(() => sendResponse(false))
  } else if (request.command === 'getState') {
    getState(sender.tab.id, sendResponse)
  }
  return true
})

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let id = tabs.length && tabs[0].id
  if (id) getState(id, render)
})

chrome.tabs.onActivated.addListener(function (activeInfo) {
  return getState(activeInfo.tabId, render)
})

function render (state) {
  chrome.browserAction.setIcon({ path: state.enabled ? ICONS.on : ICONS.off })
  chrome.browserAction.setTitle({ title: `XP Cli - ${state.enabled ? 'ON' : 'OFF'}` })
}

function getState (id, callback) {
  chrome.storage.local.get(NAMESPACE, (result) => {
    let state = result[NAMESPACE] || {}
    state = state[id] || {}
    if (callback) callback(state)
  })
}

function setState (id, state, callback) {
  chrome.storage.local.get(NAMESPACE, (obj) => {
    obj = obj || {}
    obj[NAMESPACE] = obj[NAMESPACE] || {}
    obj[NAMESPACE][id] = state
    if (!state.enabled) delete obj[NAMESPACE][id]
    chrome.storage.local.set(obj, () => {
      if (callback) callback(state)
    })
  })
}
