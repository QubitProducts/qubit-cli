/* globals chrome fetch */
const SYNC_ENDPOINT = 'https://localhost:1234/sync'
const NAMESPACE = 'xp-cli'
const ICONS = {
  on: 'icons/on48.png',
  off: 'icons/off48.png'
}

chrome.browserAction.onClicked.addListener(() => {
  getState((state) => setState({ disabled: !state.disabled }, render))
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.xp) {
    connect(request.url)
      .then((response) => response.json().then(sendResponse))
      .catch(() => sendResponse(false))
  }
})

getState(render)

function render (state) {
  chrome.browserAction.setIcon({ path: state.disabled ? ICONS.off : ICONS.on })
  chrome.browserAction.setTitle({ title: `XP Cli - ${state.disabled ? 'OFF' : 'ON'}` })
}

function getState (callback) {
  chrome.storage.local.get(NAMESPACE, (result) => callback(result[NAMESPACE]))
}

function setState (state, callback) {
  let obj = {}
  obj[NAMESPACE] = state
  chrome.storage.local.set(obj, () => callback && callback(state))
}

function connect (url) {
  return new Promise(function (resolve, reject) {
    chrome.cookies.get({
      'url': url,
      'name': 'apsess'
    }, function sendCookie (cookie, request, sendResponse) {
      if (!cookie) return reject()
      return fetch(SYNC_ENDPOINT, {
        mode: 'cors',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.assign({}, request, {
          value: cookie && cookie.value
        }))
      }).then(resolve, reject)
    })
  })
}
