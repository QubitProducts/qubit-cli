/* globals describe it */
var modules = {
  jquery: require('jquery'),
  cookieman: require('cookieman')
}
window.__qubit = {
  amd: {
    require: function (deps, cb) {
      if (!cb) return modules[deps]
      cb.apply(cb, deps.map(function (name) {
        return modules[name]
      }))
    }
  }
}
var execution = require('../execution')
var expect = require('chai').expect

describe('execution', function () {
  it('should blah', function () {
    execution({})
    expect(true).to.eql(true)
  })
})
