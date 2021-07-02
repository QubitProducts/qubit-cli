const os = require('os')
const path = require('path')
const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
const CERT_DIR = path.join(HOME, '.qubit-ssl')
const CERT_PATH = path.join(CERT_DIR, 'qubit-serve.crt')
const KEY_PATH = path.join(CERT_DIR, 'qubit-serve.key')
const KEY_OPTIONS = {
  days: 365,
  selfSigned: true,
  organization: 'Qubit',
  commonName: 'localhost',
  altNames: ['localhost']
}
const QUBITRC = `${os.homedir()}/.qubitrc`
const NPMRC = `${os.homedir()}/.npmrc`
const ID_TOKEN = 'ID_TOKEN'
const APP_TOKEN = 'APP_TOKEN'
const REGISTRY_TOKEN = 'REGISTRY_TOKEN'
const REGISTRY_SCOPES = 'REGISTRY_SCOPES'
const STYLE_EXTENSION = '.less'
const CLIENT_PATH = path.join(__dirname, 'client')
const CAMPAIGN_TYPES = {
  EVIDENCE_SELECTION: 'EVIDENCE_SELECTION',
  RECOMMENDATIONS: 'RECOMMENDATIONS',
  PERSONALISED_CONTENT: 'PERSONALISED_CONTENT'
}
const PLACEMENT_JS = `module.exports = function renderPlacement ({ content, onImpression, onClickthrough }) {
  if (content) {

  } else {
    // The content may be null under certain circumstances but in these cases the onImpression and
    //   onClickthrough should still be implemented, see docs.qubit.com/[..something..] for more information
  }
}`

const PLACEMENT_TEST_JS = `
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
`

module.exports = {
  HOME,
  CERT_DIR,
  CERT_PATH,
  KEY_PATH,
  KEY_OPTIONS,
  QUBITRC,
  NPMRC,
  ID_TOKEN,
  APP_TOKEN,
  REGISTRY_TOKEN,
  REGISTRY_SCOPES,
  STYLE_EXTENSION,
  CLIENT_PATH,
  CAMPAIGN_TYPES,
  PLACEMENT_JS,
  PLACEMENT_TEST_JS
}
