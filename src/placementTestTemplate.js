const renderPlacement = require('./placement')
const setup = require('@qubit/jest/setup')

describe('placement.js', () => {
  let content, api, teardown

  beforeEach(() => {
    ;({ api, teardown } = setup({ elements: [createElement()] }))
  })

  afterEach(() => {
    teardown()
    document.body.innerHTML = ''
  })

  describe('with content', () => {
    test('calls onImpression', () => {
      renderPlacement({ ...api, content })

      expect(api.onImpression.mock.calls.length).toBe(1)
    })

    test('calls onClickthrough', () => {
      renderPlacement({ ...api, content })

      // click
      expect(api.onClickthrough.mock.calls.length).toBe(1)
    })

    test('cleans up after itself', () => {
      renderPlacement({ ...api, content })

      const el = document.querySelector('.hero').parentElement
      expect(el.parentElement).toBeDefined()
      expect(api.elements[0].parentElement).toBeNull()
      teardown()
      expect(el.parentElement).toBeNull()
      expect(api.elements[0].parentElement).toBeDefined()
    })
  })

  describe('with null content', () => {
    beforeEach(() => {
      content = null
    })

    test('calls onImpression', () => {
      renderPlacement({ ...api, content })

      expect(api.onImpression.mock.calls.length).toBe(1)
    })

    test('calls onClickthrough', () => {
      renderPlacement({ ...api, content })

      // click

      expect(api.onClickthrough.mock.calls.length).toBe(1)
    })
  })
})

function createElement () {
  // create the elements that will be on the page when your placement runs
}
