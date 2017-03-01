module.exports = function (experience) {
  return experience.id + '-' + experience.name.toLowerCase().replace(/[^\w]/g, '-')
}
