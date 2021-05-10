const path = require('path')
const fs = require('fs-extra')
const confirmer = require('confirmer')

module.exports = async function renameFileWarning (dest, from, to) {
  const fromPath = path.join(dest, from)
  const toPath = path.join(dest, to)

  const [fromExists, toExists] = await Promise.all([
    fs.pathExists(fromPath),
    fs.pathExists(toPath)
  ])
  if (fromExists && !toExists) {
    const result = await confirmer(
      `${from} is now ${to}, is it ok to rename your ${from} file? (y/n)`
    )
    if (!result) await fs.ensureFile(fromPath)
    return fs.move(fromPath, toPath)
  }
}
