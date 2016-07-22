/* globals chrome fetch */
var XP_ENDPOINT = 'https://localhost:1234/sync'

var ICONS = {
  on: 'icons/on48.png',
  off: 'icons/off48.png'
}

getXpOn(render)

chrome.browserAction.onClicked.addListener(() => getXpOn((xpOn) => setXpOn(!xpOn)))

function getXpOn (callback) {
  chrome.storage.local.get('xpOn', (result) => callback(Boolean(result.xpOn)))
}

function setXpOn (xpOn) {
  chrome.storage.local.set({ 'xpOn': xpOn }, () => render(xpOn))
}

function render (xpOn) {
  if (xpOn) {
    chrome.browserAction.setIcon({ path: ICONS.on })
    chrome.browserAction.setTitle({ title: 'XP Cli - ON' })
  } else {
    chrome.browserAction.setIcon({ path: ICONS.off })
    chrome.browserAction.setTitle({ title: 'XP Cli - OFF' })
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.xp) {
    getCookie(request, (cookie) => handleCookie(cookie, request, sendResponse))
  }
})

function getCookie (request, callback) {
  return chrome.cookies.get({
    'url': request.url,
    'name': 'apsess'
  }, callback)
}

function handleCookie (cookie, request, sendResponse) {
  if (!cookie) return sendResponse(false)
  connect(request, cookie)
    .then(function (response) {
      return response.json().then(sendResponse)
    }, function () {
      sendResponse(false)
    })
}

function connect (request, cookie) {
  return fetch(XP_ENDPOINT, {
    mode: 'cors',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(Object.assign({}, request, {
      value: cookie && cookie.value
    }))
  })
}
