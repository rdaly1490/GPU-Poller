const express = require("express");

const GPUPoller = require("./gpuPoller");
const Helpers = require("./helpers");
const { GPU_LIST, PORT } = require("./config");

const ERROR_MSG = "<h1>An Error Occurred. Please check server logs.</h1>";

const app = express();
const gpuPoller = new GPUPoller(GPU_LIST);
let isPolling;

app.get("/", (req, res) => {
  const status = isPolling ? "up and running" : "down";
  res.send(
    `<h1>Poller is ${status}...</h1>
    ${Helpers.getHTMLForLastPoll(gpuPoller.lastResults)}`
  );
});

app.get("/start-poller", (req, res) => {
  const isSuccessful = Helpers.safelyExecuteFunction(gpuPoller, "beginPolling");
  if (isSuccessful) {
    const msg = isPolling
      ? "<h1>Poller Already Running</h1>"
      : "<h1>Poller Successfully Started</h1>";
    res.send(msg);
    isPolling = true;
  } else {
    res.send(ERROR_MSG);
  }
});

app.get("/stop-poller", (req, res) => {
  const isSuccessful = Helpers.safelyExecuteFunction(
    gpuPoller,
    "cancelPolling"
  );
  if (isSuccessful) {
    const msg = isPolling
      ? "<h1>Poller Successfully Stopped</h1>"
      : "<h1>No Poller Running To Stop</h1>";
    res.send(msg);
    isPolling = false;
  } else {
    res.send(ERROR_MSG);
  }
});

app.get("/message-records", (req, res) => {
  const listItems = gpuPoller.IDsMessageSentFor.reduce((str, id) => {
    const correspondingGPU =
      GPU_LIST.filter(gpu => gpu.productId === id)[0] || {};
    return (str += `<li>${correspondingGPU.description || "Unknown"}</li>`);
  }, "");
  res.send(`<h1>Current Message Sent Records</h1><ul>${listItems}</ul>`);
});

app.get("/reset-message-records", (req, res) => {
  gpuPoller.IDsMessageSentFor = [];
  res.send(
    "<h1>The history of IDs that text messages have been sent for has been reset.</h1>"
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // When server starts up or if it restarts try to begin polling
  const isSuccessful = Helpers.safelyExecuteFunction(gpuPoller, "beginPolling");
  isPolling = isSuccessful;
});
