const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const getPreviewLinks = require('../lib/preview-links')
const chalk = require('chalk')
const ncp = require('copy-paste')

module.exports = async function qa (options) {
  const pkg = await getPkg()
  pkg.meta = pkg.meta || {}
  const { propertyId, experienceId } = pkg.meta
  const previewLinks = await getPreviewLinks(pkg.meta)

  if (!propertyId || !experienceId) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to open the overview page for an existing experience`)
  }

  const template = `
    #### Links
    **Preview:** ${previewLinks.join('\n')}
    **Dashboard:** https://app.qubit.com/p/${propertyId}/experiences/${experienceId}
    **Asana:**
    **XP:** \`xp clone ${propertyId} ${experienceId}\`

    #### What does it do and how do I run it?

    A clear and concise description that uses no pre assumed knowledge of how the site works, no vertical/client specific abbreviations and includes a screenshot and/or replication procedure for particularly complex builds.

    #### Checklist

    I can confirm that:

    - [ ] This task matches the brief (split, segment, trigger, goals)
    - [ ] The code has no linting issues and is in Standard JS style
    - [ ] All console logs, unnecessary comments and debug/preview methods have been removed
    - [ ] Pollers are guarded where possible and all elements/variables are polled for
    - [ ] There are no clashing namespaces
    - [ ] I have tested this end-to-end and seen this working **after** the final code change
  `
  log(template)
  ncp.copy(template, () => log(chalk.green('QA template copied to clipboard')))
}
