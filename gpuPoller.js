const request = require("request");
const moment = require("moment");
const colors = require("colors");
const twilio = require("twilio");

const {
  POLLING_INTERVAL,
  URL_SEGMENT,
  TWILIO_PHONE_NUMBER,
  MY_PHONE_NUMBER,
  ACCOUNT_SID,
  AUTH_TOKEN
} = require("./config");

class GPUPoller {
  constructor(gpus) {
    this.gpus = gpus;
    this.poller = null;
    this.twilioClient = new twilio(ACCOUNT_SID, AUTH_TOKEN);
    this.IDsMessageSentFor = [];
    this.lastResults = [];
  }

  beginPolling() {
    if (this.poller) return;
    this.poller = setInterval(() => {
      this.makeNetworkCall();
    }, POLLING_INTERVAL);
    console.log("New Poller Initialized");
  }

  cancelPolling() {
    if (!this.poller) return;
    clearInterval(this.poller);
    this.poller = null;
    this.clearLastResults();
    console.log("Poller Removed");
  }

  makeNetworkCall() {
    request(this.getCompleteURL(), (error, res, body) => {
      if (error) {
        this.handleNetworkError(error);
      }
      // there's a weird long jQuery hash value or something that we need to remove before trying to parse
      const trimToIndex = body.indexOf("(") + 1;
      const formattedBody = body.slice(trimToIndex, body.length - 1);
      const gpus = JSON.parse(formattedBody).products.product;
      this.analyzeNetworkResponse(gpus);
    });
  }

  getCompleteURL() {
    return URL_SEGMENT + this.getEndOfURL();
  }

  getEndOfURL() {
    const urlEncodedComma = "%2C";
    const endingQueryParam = "&_=1522978283982";
    const productIdsQueryString = this.gpus.reduce((str, gpu, i) => {
      const productId =
        i === this.gpus.length - 1
          ? gpu.productId
          : gpu.productId + urlEncodedComma;
      return (str += productId);
    }, "&productId=");
    return productIdsQueryString + endingQueryParam;
  }

  handleNetworkError(e) {
    console.log(this.getTimestamp());
    console.log(
      `An error has occurred and polling has been interrupted. Error: ${JSON.stringify(
        error
      )}`.white.bgRed
    );
    this.cancelPolling();
    this.sendTextMessage("Polling has stopped, check server logs.");
  }

  getTimestamp() {
    return moment().format("ddd MMM DD YYYY hh:mm A");
  }

  analyzeNetworkResponse(gpus) {
    const timeStamp = this.getTimestamp();
    this.clearLastResults();
    this.logAndStoreMessage(timeStamp);
    gpus.forEach(gpu => {
      const description = this.GPUDescription(gpu.id);
      const inventoryStatus = gpu.inventoryStatus.productIsInStock;
      if (inventoryStatus === "true") {
        const inStockMessage = `${description} IS IN STOCK! Price: ${gpu.pricing
          .formattedListPrice}`;
        this.logAndStoreMessage(inStockMessage, "green");

        // To stop from getting duplicate text messages
        if (!this.IDsMessageSentFor.includes(gpu.id)) {
          this.sendTextMessage(inStockMessage, gpu.id);
        }
      } else {
        this.removeIfInMessageHisory(gpu.id); // The product may have sold out since being in stock
        this.logAndStoreMessage(`${description} is not in stock`, "red");
      }
    });
  }

  removeIfInMessageHisory(id) {
    const index = this.IDsMessageSentFor.indexOf(id);
    if (index >= 0) {
      // Ensure we're notified when the product comes back in stock
      this.IDsMessageSentFor.splice(index, 1);
    }
  }

  clearLastResults() {
    this.lastResults = [];
  }

  logAndStoreMessage(msg, msgTreatment = "white") {
    console.log(msg[msgTreatment]);
    this.lastResults.push(msg);
  }

  GPUDescription(id) {
    return this.gpus.filter(gpu => gpu.productId === id)[0].description;
  }

  sendTextMessage(message, productId = null) {
    this.twilioClient.messages
      .create({
        body: message,
        to: MY_PHONE_NUMBER,
        from: TWILIO_PHONE_NUMBER
      })
      .then(message => {
        if (productId) {
          this.IDsMessageSentFor.push(productId);
        }
        console.log(
          `Message successfully delivered SID: ${message.sid}`.black.bgGreen
        );
      })
      .catch(e =>
        console.log(
          `Twilio Message was not delivered. Error:  ${JSON.stringify(e)}`.white
            .bgRed
        )
      );
  }
}

module.exports = GPUPoller;
