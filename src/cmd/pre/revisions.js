const chalk = require('chalk')
const throwIf = require('../../lib/throw-if')
const getPkg = require('../../lib/get-pkg')
const preService = require('../../services/pre')
const log = require('../../lib/log')
const { getPropertyId } = require('../../lib/get-resource-ids')

module.exports = async function revisions (propertyId) {
  await throwIf.pre('status')
  const pkg = await getPkg()
  propertyId = await getPropertyId(propertyId, pkg)
  const revisions = await preService.revisions(propertyId)
  if (!revisions.length) {
    log.warn('This property does not have a pre script')
    return
  }
  for (let i = 0; i < revisions.length; i++) {
    const revision = revisions[i]
    if (i === revisions.length - 1) {
      printDraft(revision, i + 1)
    } else {
      printPublished(revision, i + 1, i === revisions.length - 2)
    }
  }
}

function printDraft (revision, number) {
  console.log(`
${chalk.bold(`Revision #${number}`)} - ${chalk.bold.magenta('draft')}
  ${chalk.bold.gray('Last updated at:')} ${revision.updatedAt}
  ${chalk.bold.gray('Last updated by:')} ${revision.updatedBy.email}
`)
}

function printPublished (revision, number, isLive) {
  console.log(`
${chalk.bold(`Revision #${number}`)}${
    isLive ? ' - ' + chalk.bold.red('live') : ''
  }
  ${chalk.bold.gray('Published at:')} ${revision.publishedAt}
  ${chalk.bold.gray('Published by:')} ${revision.publishedBy.email}
  ${chalk.bold.gray('Changelog:')} ${revision.changelog || '-'}
`)
}
