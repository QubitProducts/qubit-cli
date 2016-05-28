module.exports = function logError (err) {
  console.log(err.message, err.stack)
}
