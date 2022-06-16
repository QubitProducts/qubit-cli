module.exports = function applyStyles (id, styles) {
  const el = document.getElementById(id) || document.createElement('style')
  el.id = id

  // Keep alignment with experiences which appends styles first before module styles
  const styleTags = document.getElementsByTagName('style')
  if (
    styleTags &&
    styleTags.length &&
    styleTags[0].parentElement.nodeName === 'HEAD'
  ) {
    document.head.insertBefore(el, styleTags[0])
  } else {
    document.head.appendChild(el)
  }

  el.innerHTML = styles
  return () => {
    const el = document.getElementById(id)
    if (el) el.parentElement.removeChild(el)
  }
}
