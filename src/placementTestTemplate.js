/* globals beforeEach afterEach test describe expect */

const renderPlacement = require('./placement')
const setup = require('@qubit/jest/setup')
const content = require('./payload.json')

describe('placement.js', () => {
  let fixture

  afterEach(() => {
    fixture.teardown()
    document.body.innerHTML = ''
  })

  describe('with content', () => {
    beforeEach(() => {
      fixture = setup({ elements: [createElement()], content })
    })

    test('calls onImpression', () => {
      renderPlacement(fixture.api)

      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    test('calls onClickthrough', () => {
      renderPlacement(fixture.api)

      // click
      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })

    test('cleans up after itself', () => {
      renderPlacement(fixture.api)

      const el = document.querySelector('.hero').parentElement
      expect(el.parentElement).toBeDefined()
      expect(fixture.api.elements[0].parentElement).toBeNull()
      fixture.teardown()
      expect(el.parentElement).toBeNull()
      expect(fixture.api.elements[0].parentElement).toBeDefined()
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      fixture = setup({ elements: [createElement()], content: null })
    })

    test('calls onImpression', () => {
      renderPlacement(fixture.api)

      expect(fixture.api.onImpression.mock.calls.length).toBe(1)
    })

    test('calls onClickthrough', () => {
      renderPlacement(fixture.api)

      // click

      expect(fixture.api.onClickthrough.mock.calls.length).toBe(1)
    })
  })
})

function createElement () {
  // create the elements that will be on the page when your placement runs
}
