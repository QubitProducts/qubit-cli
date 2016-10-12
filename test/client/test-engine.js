var sinon = require('sinon')
var engine = require('../../src/client/engine')
var expect = require('chai').expect

describe('engine', function () {
  var globalFn, activationFn, variationFn, callCallback, options

  beforeEach(function () {
    variationFn = sinon.stub()
    globalFn = sinon.stub()
    options = { isOptions: true }
  })

  describe('sync activations', function () {
    beforeEach(function () {
      activationFn = sinon.spy(function (options, cb) {
        return callCallback
      })
    })
  })

  describe('async activations', function () {
    beforeEach(function () {
      activationFn = sinon.spy(function (options, cb) {
        if (callCallback) cb()
      })
    })

    describe('activation returns false', function () {
      beforeEach(function () {
        callCallback = false
      })

      it('should execute global', function () {
        engine(options, globalFn, activationFn, variationFn)
        expect(globalFn.calledOnce).to.eql(true)
      })

      it('should execute triggers', function () {
        engine(options, globalFn, activationFn, variationFn)
        expect(activationFn.calledOnce).to.eql(true)
      })

      it('should not execute variation', function () {
        engine(options, globalFn, activationFn, variationFn)
        expect(variationFn.called).to.eql(false)
      })
    })

    describe('activation returns true', function () {
      beforeEach(function () {
        callCallback = true
      })

      it('should execute global', function () {
        engine(options, globalFn, activationFn, variationFn)
        expect(globalFn.calledOnce).to.eql(true)
      })

      it('should execute triggers', function () {
        engine(options, globalFn, activationFn, variationFn)
        expect(activationFn.calledOnce).to.eql(true)
      })

      it('should execute variationFn', function () {
        engine(options, globalFn, activationFn, variationFn)
        expect(variationFn.calledOnce).to.eql(true)
      })
    })
  })
})
