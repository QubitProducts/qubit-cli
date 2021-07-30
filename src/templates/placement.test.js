/* globals beforeEach afterEach it describe expect */
const setup = require('@qubit/jest/setup')
const content = require('./payload.json')
const renderPlacement = require('./placement')
const getPlacementElement = () => document.querySelector('.QubitPlacement')

describe('placement.js', () => {
  let fixture

  afterEach(() => {
    fixture.teardown()
    document.body.innerHTML = ''
  })

  describe('with content', () => {
    beforeEach(() => {
      fixture = setup({ content, elements: [createDom()] })
      return renderPlacement(fixture.api)
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      getPlacementElement().click()
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })

    it('cleans up after itself', () => {
      const el = getPlacementElement()
      expect(document.body.contains(el)).toBe(true)
      fixture.teardown()
      expect(document.body.contains(el)).toBe(false)
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      fixture = setup({ content: null, elements: [createDom()] })
      return renderPlacement(fixture.api)
    })

    it('calls onImpression', () => {
      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    it('calls onClickthrough', () => {
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(0)
      fixture.api.elements[0].click()
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })
  })
})

// create the elements that will be on the page when your placement runs
function createDom () {
  const el = document.createElement('div')
  el.innerHTML = '<a/>'
  document.body.append(el)
  return el
}
