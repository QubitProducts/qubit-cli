document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('stateSwitch')
  toggle.checked = getXpCliOn()
  toggle.addEventListener('change', function () {
    var val = this.checked
    setXpCliOn(val)
    sendMessage({ xpCliOn: val })
  })
})

function setXpCliOn (val) {
  window.localStorage.xpCliOn = JSON.stringify(val)
}

function getXpCliOn () {
  var val = window.localStorage.xpCliOn || 'true'
  return JSON.parse(val)
}

function sendMessage (message) {
  window.chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    window.chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      console.log(response)
    })
  })
}
