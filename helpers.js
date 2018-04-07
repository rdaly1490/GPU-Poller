class Helpers {
  static safelyExecuteFunction(cb) {
    let successfullyExecuted = true;
    try {
      cb();
    } catch (e) {
      console.log(e);
      successfullyExecuted = false;
    }
    return successfullyExecuted;
  }
}

module.exports = Helpers;
