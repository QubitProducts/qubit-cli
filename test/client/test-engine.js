const sinon = require('sinon')
const engine = require('../../src/client/engine')
const expect = require('chai').expect

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

    describe('activation returns false', function () {
      beforeEach(function () {
        callCallback = false
        engine(options, globalFn, activationFn, variationFn)
      })

      it('should execute global', function () {
        expect(globalFn.calledOnce).to.eql(true)
      })

      it('should execute triggers', function () {
        expect(activationFn.calledOnce).to.eql(true)
      })

      it('should not exectute the variation', function () {
        expect(variationFn.calledOnce).to.eql(false)
      })
    })

    describe('activation returns true', function () {
      beforeEach(function () {
        callCallback = true
        engine(options, globalFn, activationFn, variationFn)
      })

      it('should execute global', function () {
        expect(globalFn.calledOnce).to.eql(true)
      })

      it('should execute triggers', function () {
        expect(activationFn.calledOnce).to.eql(true)
      })

      it('should exectute the variation', function () {
        expect(variationFn.calledOnce).to.eql(true)
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
        engine(options, globalFn, activationFn, variationFn)
      })

      it('should execute global', function () {
        expect(globalFn.calledOnce).to.eql(true)
      })

      it('should execute triggers', function () {
        expect(activationFn.calledOnce).to.eql(true)
      })

      it('should not execute variation', function () {
        expect(variationFn.called).to.eql(false)
      })
    })

    describe('activation returns true', function () {
      beforeEach(function () {
        callCallback = true
        engine(options, globalFn, activationFn, variationFn)
      })

      it('should execute global', function () {
        expect(globalFn.calledOnce).to.eql(true)
      })

      it('should execute triggers', function () {
        expect(activationFn.calledOnce).to.eql(true)
      })

      it('should execute variationFn', function () {
        expect(variationFn.calledOnce).to.eql(true)
      })
    })
  })
})
