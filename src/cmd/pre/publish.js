const throwIf = require('../../lib/throw-if')
const getPkg = require('../../lib/get-pkg')
const preService = require('../../services/pre')
const writePkg = require('../../lib/write-pkg')
const terminal = require('../../lib/terminal')
const log = require('../../lib/log')

module.exports = async function publish (options = {}) {
  await throwIf.pre('publish')
  const pkg = await getPkg()
  const { propertyId } = pkg.meta || {}

  if (!options.force) {
    const revision = await preService.get(propertyId, 'draft')
    const remoteUpdatedAt = revision.updatedAt
    const localUpdatedAt = pkg.meta.remoteUpdatedAt

    if (remoteUpdatedAt !== localUpdatedAt) {
      throw new Error(
        'Your local draft is out of sync with the remote revision. Use `qubit pre diff` to see the difference, and `qubit pre publish --force` if you wish to force publish the remote draft to live.'
      )
    }
  }

  const changelog = await terminal.inputField(
    'Describe the changes you are publishing'
  )
  if (!changelog) {
    // Otherwise the error appears on the same line
    console.log('')
    throw new Error('Changelog required')
  }

  log.info('Publishing draft pre script...')
  const newRevision = await preService.publish(propertyId, changelog)
  await writePkg(newRevision.packageJson)
  log.info('Published!')
}
