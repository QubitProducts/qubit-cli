const validControlSizes = [0, 0.05, 0.5, 0.8]

function isInvalid (controlSize) {
  return !(validControlSizes.indexOf(controlSize) > -1)
}

module.exports = { validControlSizes, isInvalid }
