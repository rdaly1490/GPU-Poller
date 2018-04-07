const express = require("express");

const GPUPoller = require("./gpuPoller");
const { GPU_LIST, PORT } = require("./config");

const app = express();
const gpuPoller = new GPUPoller(GPU_LIST);
let isPolling = false;

app.get("/", (req, res) => {
  const status = isPolling ? "up and running" : "down";
  res.send(`<h1>Poller is ${status}...</h1>`);
});

app.get("/start-poller", (req, res) => {
  try {
    gpuPoller.beginPolling();
  } catch (e) {
    console.log(e);
    res.send("<h1>An Error Occurred. Please check server logs.</h1>");
    return;
  }

  isPolling = true;
  res.send("<h1>Poller Successfully Started</h1>");
});

app.get("/stop-poller", (req, res) => {
  try {
    gpuPoller.cancelPolling();
  } catch (e) {
    console.log(e);
    res.send(
      "<h1>An Error Occurred When Stopping The Poller. Please check server logs.</h1>"
    );
    return;
  }

  isPolling = false;
  res.send("<h1>Poller Successfully Stopped</h1>");
});

app.get("/reset-message-records", (req, res) => {
  gpuPoller.IDsMessageSentFor = [];
  res.send(
    "<h1>The history of IDs that text messages have been sent for has been reset.</h1>"
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
