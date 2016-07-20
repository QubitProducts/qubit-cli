/* globals chrome fetch */
var HOST = 'https://localhost:1234/sync'

var ICON = {
  on: 'icons/on48.png',
  off: 'icons/off48.png'
}

var XPCLION = true

getXpCliOn(function (xpCliOn) {
  XPCLION = xpCliOn
  render()
  chrome.browserAction.onClicked.addListener(function () {
    setXpCliOn(!XPCLION)
  })
})

function getXpCliOn (callback) {
  chrome.storage.local.get('xpCliOn', function (result) {
    if (result && typeof result.xpCliOn === 'boolean') {
      callback(result.xpCliOn)
    } else {
      callback(true)
    }
  })
}

function setXpCliOn (xpCliOn) {
  chrome.storage.local.set({ 'xpCliOn': xpCliOn }, function () {
    XPCLION = xpCliOn
    render()
  })
}

function render () {
  if (XPCLION) {
    setTitle('XP Cli - ON')
    setIcon(ICON.on)
  } else {
    setTitle('XP Cli - OFF')
    setIcon(ICON.off)
  }
}

function setIcon (icon) {
  chrome.browserAction.setIcon({ path: icon })
}

function setTitle (text) {
  chrome.browserAction.setTitle({ title: text })
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
  return fetch(HOST, {
    mode: 'cors',
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(Object.assign({}, request, {
      value: cookie && cookie.value
    }))
  })
}
