const getPkg = require('../lib/get-pkg')
const checkDiff = require('../lib/check-diff')
let CWD = process.cwd()

module.exports = async function diff () {
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta
  await checkDiff(CWD, propertyId, experienceId)
}
