/* globals chrome fetch */
const CONNECT_ENDPOINT = 'https://localhost:41337/connect'
const NAMESPACE = 'qubit-cli'
const ICONS = { on: 'icons/on48.png', off: 'icons/off48.png' }

renderExtensionIcon()

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
    const tabId = tabs.length && tabs[0].id
    if (tabId) {
      await getState(tabId, (state = {}) =>
        setState(tabId, { enabled: !state.enabled }, renderExtensionIcon)
      )
    }
  })
})

chrome.tabs.onRemoved.addListener(tabId =>
  setState(tabId, {}, renderExtensionIcon)
)

chrome.tabs.onUpdated.addListener(renderExtensionIcon)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'connect') {
    return fetch(CONNECT_ENDPOINT, {
      mode: 'cors',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: request.url })
    })
      .then(response => {
        response.json().then(sendResponse)
      })
      .catch(() => {
        sendResponse(false)
      })
  } else if (request.command === 'getState') {
    getState(sender.tab.id, (state = {}) => {
      sendResponse(state)
    })
  }
  return true
})

function renderExtensionIcon () {
  chrome.windows.getLastFocused(null, window => {
    chrome.tabs.query({ active: true }, tab => {
      chrome.action.setIcon({ path: ICONS.off })
      chrome.action.setTitle({ title: 'Qubit CLI - OFF' })
    })
  })
  chrome.tabs.query({}, tabs => {
    tabs.forEach(async tab => {
      await getState(tab.id, state => {
        chrome.action.setIcon({
          path: state.enabled ? ICONS.on : ICONS.off,
          tabId: tab.id
        })
        chrome.action.setTitle({
          title: `Qubit CLI - ${state.enabled ? 'ON' : 'OFF'}`,
          tabId: tab.id
        })
      })
    })
  })
}

async function getState (id, callback) {
  const globalState = await chrome.storage.local.get(NAMESPACE)
  const extensionState = globalState[NAMESPACE] || {}
  const state = extensionState[id] || {}
  if (callback) callback(state)
  return state[id]
}

function setState (id, state, callback) {
  chrome.storage.local.get(NAMESPACE, obj => {
    obj = obj || {}
    obj[NAMESPACE] = obj[NAMESPACE] || {}
    obj[NAMESPACE][id] = state
    if (!state.enabled) delete obj[NAMESPACE][id]
    chrome.storage.local.set(obj, () => {
      if (callback) callback(state)
    })
  })
}
