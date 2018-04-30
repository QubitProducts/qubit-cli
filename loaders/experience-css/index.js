module.exports = src =>
  src
    .replace(
      /require\(['"]css!([^)]+)['"]/g,
      (all, thing) => "require('" + thing + ".css'"
    )
    .replace(
      /require\(['"]less!([^)]+)['"]/g,
      (all, thing) => "require('" + thing + ".less'"
    )
