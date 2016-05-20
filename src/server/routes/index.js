module.exports = function routes (app) {
  app.post('/sync', require('./sync'))
}
