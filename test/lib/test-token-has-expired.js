const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const tokenHasExpired = require('../../src/lib/token-has-expired')

describe('token-has-expired', function () {
  let token, now
  beforeEach(() => {
    now = Math.floor(Date.now() / 1000) * 1000
    token = jwt.sign(
      {
        exp: now / 1000,
        data: 'foobar'
      },
      'secret'
    )
  })

  it('should be expired if it expires exactly now', async function () {
    expect(tokenHasExpired(token, now, 0)).to.eql(true)
  })

  it('should not be expired if it expires in 1 second', async function () {
    expect(tokenHasExpired(token, now - 1000, 0)).to.eql(false)
  })

  it('should be expired if it expires in 1 second with a required buffer of 1 second', async function () {
    expect(tokenHasExpired(token, now - 1000, 1000)).to.eql(true)
  })

  it('should not be expired if it expires in 2 second with a required buffer of 1 second', async function () {
    expect(tokenHasExpired(token, now - 2000, 1000)).to.eql(false)
  })
})
