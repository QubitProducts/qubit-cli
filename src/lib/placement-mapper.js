module.exports = { toFiles, fromFiles }
const PAYLOAD_JSON = 'payload.json'
const PLACEMENT_JS = 'placement.js'
const PLACEMENT_LESS = 'placement.less'
const PACKAGE_JSON = 'package.json'

function toFiles (code, samplePayload) {
  return {
    [PAYLOAD_JSON]: JSON.stringify(samplePayload, null, 2),
    [PLACEMENT_JS]: code.js,
    [PLACEMENT_LESS]: code.css,
    [PACKAGE_JSON]: JSON.stringify(code.packageJson, null, 2)
  }
}

function fromFiles (files) {
  return {
    schema: {
      samplePayload: JSON.parse(files[PAYLOAD_JSON])
    },
    code: {
      js: files[PLACEMENT_JS],
      css: files[PLACEMENT_LESS],
      packageJson: JSON.parse(files[PACKAGE_JSON])
    }
  }
}
