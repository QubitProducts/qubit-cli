function execution (options) {
  options.log.info('Hello from variation')
  return {
    remove: () => options.log.info('Cleaning up variation')
  }
}
