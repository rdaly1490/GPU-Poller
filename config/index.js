const constants = require("./constants");
module.exports = (() => {
  if (process.env.NODE_ENV === "production") {
    return {
      ...constants,
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
      MY_PHONE_NUMBER: process.env.MY_PHONE_NUMBER,
      ACCOUNT_SID: process.env.ACCOUNT_SID,
      AUTH_TOKEN: process.env.AUTH_TOKEN
    };
  } else {
    const keys = require("./keys");
    return {
      ...constants,
      ...keys
    };
  }
})();
