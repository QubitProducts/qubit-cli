const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const pullExperience = require('../lib/pull-experience')
const getPkg = require('../lib/get-pkg')
const CWD = process.cwd()

module.exports = async function pullAll () {
  const directories = await fs.readdir(CWD)
  for (const dirname of directories) {
    const experienceDir = path.join(CWD, dirname)
    const pkg = await getPkg(experienceDir)
    if (pkg && _.get(pkg, 'meta.experienceId') && _.get(pkg, 'meta.propertyId')) {
      const { experienceId, propertyId } = pkg.meta
      await pullExperience(experienceDir, propertyId, experienceId)
    }
  }
}
