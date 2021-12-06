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
      
      make create-install-private-packages


    `

    for (const dep of deps) {
      expect(dep.startsWith('@qubit')).to.eql(false, msg)
      expect(dep.startsWith('@qutics')).to.eql(false, msg)
    }
  })

  it('should have an up to date private package lock', async () => {
    const msg = `
      We detected that some recent changes were made to your package-lock.json file without
      updating your private-package-lock.json

      Please run the following command and commit your changes:
      
      make create-install-private-packages


    `
    const [
      publicTS,
      publicLockTS,
      privateTS,
      privateLockTS
    ] = await Promise.all([
      gitTime('M', './package.json'),
      gitTime('M', './package-lock.json'),
      gitTime('M', './private-package.json'),
      gitTime('M', './private-package-lock.json')
    ])
    expect(privateTS).to.be.greaterThanOrEqual(publicTS, msg)
    expect(privateLockTS).to.be.greaterThanOrEqual(publicLockTS, msg)
  })
})
