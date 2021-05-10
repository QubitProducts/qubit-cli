module.exports = function applyStyles (id, styles) {
  const el = document.getElementById(id) || document.createElement('style')
  el.id = id
  document.head.appendChild(el)
  el.innerHTML = styles
  return () => {
    const el = document.getElementById(id)
    if (el) el.parentElement.removeChild(el)
  }
}
