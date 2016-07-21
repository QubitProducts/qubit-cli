/* globals chrome fetch */
var XP_ENDPOINT = 'https://localhost:1234/sync'

var ICON = {
  on: 'icons/on48.png',
  off: 'icons/off48.png'
}

chrome.browserAction.onClicked.addListener(function () {
  getXpCliOn((xpCliOn) => setXpCliOn(!xpCliOn))
})

getXpCliOn(render)

function getXpCliOn (callback) {
  chrome.storage.local.get('xpCliOn', function (result) {
    callback(Boolean(result.xpCliOn))
  })
}

function setXpCliOn (xpCliOn) {
  chrome.storage.local.set({ 'xpCliOn': xpCliOn }, function () {
    render(xpCliOn)
  })
}

function render (xpCliOn) {
  if (xpCliOn) {
    chrome.browserAction.setIcon({ path: ICON.on })
    chrome.browserAction.setTitle({ title: 'XP Cli - ON' })
  } else {
    chrome.browserAction.setIcon({ path: ICON.off })
    chrome.browserAction.setTitle({ title: 'XP Cli - OFF' })
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.xp) {
    chrome.cookies.get({
      'url': request.url,
      'name': 'apsess'
    }, function (cookie) {
      if (!cookie) return sendResponse(false)
      connect(request, cookie)
      .then(function (response) {
        return response.json().then(sendResponse)
      }, function () {
        sendResponse(false)
      })
    })
    return true
  }
})

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
