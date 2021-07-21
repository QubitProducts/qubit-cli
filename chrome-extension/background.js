/* globals chrome fetch */
const CONNECT_ENDPOINT = 'https://localhost:41337/connect'
const NAMESPACE = 'qubit-cli'
const ICONS = { on: 'icons/on48.png', off: 'icons/off48.png' }

render()

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs.length && tabs[0].id
    if (tabId) {
      getState(tabId, state =>
        setState(tabId, { enabled: !state.enabled }, render)
      )
    }
  })
})

chrome.tabs.onRemoved.addListener(tabId => setState(tabId, {}, render))

chrome.tabs.onUpdated.addListener(render)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'connect') {
    return fetch(CONNECT_ENDPOINT, {
      mode: 'cors',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: request.url })
    })
      .then(response => response.json().then(sendResponse))
      .catch(() => sendResponse(false))
  } else if (request.command === 'getState') {
    getState(sender.tab.id, sendResponse)
  }
  return true
})

function render () {
  chrome.windows.getLastFocused(null, window => {
    chrome.tabs.getSelected(null, tab => {
      chrome.browserAction.setIcon({ path: ICONS.off })
      chrome.browserAction.setTitle({ title: 'Qubit CLI - OFF' })
    })
  })
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      getState(tab.id, state => {
        chrome.browserAction.setIcon({
          path: state.enabled ? ICONS.on : ICONS.off,
          tabId: tab.id
        })
        chrome.browserAction.setTitle({
          title: `Qubit CLI - ${state.enabled ? 'ON' : 'OFF'}`,
          tabId: tab.id
        })
      })
    })
  })
}
let cache = {}
function getState (id, callback) {
  chrome.storage.local.get(NAMESPACE, result => {
    let state = result[NAMESPACE] || {}
    cache = state
    state = state[id] || {}
    if (callback) callback(state)
  })
  return cache[id]
}

function setState (id, state, callback) {
  chrome.storage.local.get(NAMESPACE, obj => {
    obj = obj || {}
    obj[NAMESPACE] = obj[NAMESPACE] || {}
    obj[NAMESPACE][id] = state
    if (!state.enabled) delete obj[NAMESPACE][id]
    cache = obj
    chrome.storage.local.set(obj, () => {
      if (callback) callback(state)
    })
  })
}

chrome.webRequest.onHeadersReceived.addListener(
  responseListener,
  { urls: ['<all_urls>'] },
  ['blocking', 'responseHeaders']
)

function responseListener (details) {
  let responseHeaders = details.responseHeaders
  const state = getState(details.tabId)
  if (state.enabled) {
    responseHeaders = responseHeaders.filter(
      elem => elem.name.toLowerCase() !== 'content-security-policy'
    )
  }
  return { responseHeaders }
}
