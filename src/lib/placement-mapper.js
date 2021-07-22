const {
  FILENAME_PAYLOAD_JSON,
  FILENAME_PLACEMENT_JS,
  FILENAME_PLACEMENT_LESS,
  FILENAME_PACKAGE_JSON
} = require('../constants')

module.exports = { toFiles, fromFiles }

function toFiles (code, samplePayload) {
  return {
    [FILENAME_PAYLOAD_JSON]: JSON.stringify(samplePayload, null, 2),
    [FILENAME_PLACEMENT_JS]: code.js,
    [FILENAME_PLACEMENT_LESS]: code.css,
    [FILENAME_PACKAGE_JSON]: JSON.stringify(code.packageJson, null, 2)
  }
}

function fromFiles (files) {
  return {
    schema: {
      samplePayload: JSON.parse(files[FILENAME_PAYLOAD_JSON])
    },
    code: {
      js: files[FILENAME_PLACEMENT_JS],
      css: files[FILENAME_PLACEMENT_LESS],
      packageJson: JSON.parse(files[FILENAME_PACKAGE_JSON])
    }
  }
}
