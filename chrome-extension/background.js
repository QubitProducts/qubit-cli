/* globals chrome fetch */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.xp) {
    chrome.cookies.get({
      'url': request.url,
      'name': 'apsess'
    }, handleCookie)
    return true
  }

  function handleCookie (cookie) {
    if (!cookie) return sendResponse(false)
    connect(request, cookie)
      .then(function (response) {
        return response.json().then(sendResponse)
      }, function () {
        sendResponse(false)
      })
  }
})

function connect (request, cookie) {
  return fetch('http://localhost:1234/sync', {
    mode: 'cors',
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(Object.assign({}, request, {
      value: cookie && cookie.value
    }))
  })
}
