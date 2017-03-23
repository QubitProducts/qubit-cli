module.exports = function applyStyles (id, styles) {
  let el = document.getElementById(id) || document.createElement('style')
  el.id = id
  document.head.appendChild(el)
  el.innerHTML = styles
  return () => {
    let el = document.getElementById(id)
    if (el) el.parentElement.removeChild(el)
  }
}
