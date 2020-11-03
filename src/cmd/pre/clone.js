const path = require('path')
const preService = require('../../services/pre')
const { getPropertyId } = require('../../lib/get-resource-ids')
const getPkg = require('../../lib/get-pkg')
const scaffold = require('../../lib/scaffold')
const throwIf = require('../../lib/throw-if')
const log = require('../../lib/log')

const CWD = process.cwd()

module.exports = async function clone (propertyId) {
  await throwIf.none('clone')
  const pkg = await getPkg()
  propertyId = await getPropertyId(propertyId, pkg)
  const revision = await preService.get(propertyId, 'draft')
  const files = {
    'package.json': JSON.stringify(revision.packageJson, null, 2),
    'pre.js': revision.code
  }
  const destination = path.join(CWD, `pre-${propertyId}`)
  await scaffold(destination, files, { removeExtraneous: true })
  log.info(`Pre script cloned into ${destination}`)
}
