document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('stateSwitch')
  toggle.checked = getXpCliOn()
  toggle.addEventListener('change', updateState)
})

function updateState () {
  var val = this.checked
  sendMessage({
    type: 'XpCliOn',
    val: val
  })
  setXpCliOn(val)
}

function format () {
  sendMessage({
    type: 'format',
    val: true
  })
}

function setXpCliOn (val) {
  window.localStorage.XpCliOn = JSON.stringify(val)
}

function getXpCliOn () {
  var val = window.localStorage.XpCliOn || 'true'
  return JSON.parse(val)
}

/*
* This function sends an event to the content_script
*/
function sendMessage (message) {
  window.chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var port = window.chrome.tabs.connect(tabs[0].id)
    port.postMessage(message)
  })
}

function showFormatButton () {
  var val = window.localStorage.formatEnabled || 'false'
  return JSON.parse(val)
}
