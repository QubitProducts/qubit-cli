const { expect } = require('chai')
const gitTime = require('@inkohx/git-time').default
const pkg = require('../package.json')

describe('package.json', () => {
  it('should not have any private packages in it', () => {
    const deps = Object.keys(pkg.dependencies)
    const msg = `
      We detected some @qubit / @qutics dependencies in your package.json.
      These can only be installed after logging in with qubit-cli and therefore
      need to be installed in a separate step. To enable this please run the following
      command:
      
      npm run createInstallPrivatePackages

    `

    for (const dep of deps) {
      expect(dep.startsWith('@qubit')).to.eql(false, msg)
      expect(dep.startsWith('@qutics')).to.eql(false, msg)
    }
  })

  it('should have an up to date private package lock', async () => {
    const msg = fileName => `
      We detected that some recent changes were made to your ${fileName} file without updating your private-${fileName}

      Please run the following command and commit your changes:
      
      npm run createInstallPrivatePackages

    `
    const [
      publicTS,
      publicLockTS,
      privateTS,
      privateLockTS
    ] = await Promise.all([
      gitTime('ACDMR', './package.json'),
      gitTime('ACDMR', './npm-shrinkwrap.json'),
      gitTime('ACDMR', './private-package.json'),
      gitTime('ACDMR', './private-npm-shrinkwrap.json')
    ])
    expect(privateTS).to.be.greaterThanOrEqual(publicTS, msg('package.json'))
    expect(privateLockTS).to.be.greaterThanOrEqual(
      publicLockTS,
      msg('npm-shrinkwrap.json')
    )
  })
})
