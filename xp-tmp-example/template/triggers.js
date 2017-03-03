function triggers (options, cb) {
  options.log.info('Hello from triggers')
  cb()
  return {
    remove: () => options.log.info('Cleaning up triggers')
  }
}
