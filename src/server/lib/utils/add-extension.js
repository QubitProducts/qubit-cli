module.exports = function addExtension (name) {
  return name + (name === 'variation' ? '.css' : '.js')
}
