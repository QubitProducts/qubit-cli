module.exports = function isOneOf (items) {
  return item => {
    if (!items.includes(item)) {
      throw new Error(`'${item}' must be one of '${items.join('|')}'`)
    }
  }
}
