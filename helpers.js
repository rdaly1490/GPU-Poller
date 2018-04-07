class Helpers {
  static safelyExecuteFunction(gpuPoller, fnName) {
    let successfullyExecuted = true;
    try {
      gpuPoller[fnName]();
    } catch (e) {
      console.log(e);
      successfullyExecuted = false;
    }
    return successfullyExecuted;
  }
}

module.exports = Helpers;
