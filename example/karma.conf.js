module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    files: [ 'test/test-*' ],
    preprocessors: { '/**/*.js': ['webpack', 'sourcemap'] },
    webpack: {
      watch: true,
      devtool: 'inline-source-map',
      resolve: {
        alias: { 'jquery': require.resolve('@qubit/jquery') }
      }
    },
    webpackServer: {
      quiet: false,
      noInfo: false
    },
    browsers: ['Chrome']
  })
}
