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

  static getHTMLForLastPoll(lastPollData) {
    const [timeStamp, ...rest] = lastPollData;

    if (!timeStamp) {
      return "";
    }

    let html = `<p>${timeStamp}</p>`;
    return rest.reduce((html, gpuInfo) => {
      const colorStyle = gpuInfo.includes("Price:") // Price is only for in stock items
        ? "color:green"
        : "color:red";
      return (html += `<p style=${colorStyle};>${gpuInfo}</p>`);
    }, html);
  }
}

module.exports = Helpers;
