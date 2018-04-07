# GPU Poller

This app will periodically poll for gpu's in stock and send a text to your phone if you configure it for yourself.  You'll need to generate a keys.js file to run it locally or set some server env variables to deploy it.

The variables to add to the keys.js are:
```
TWILIO_PHONE_NUMBER,
MY_PHONE_NUMBER,
ACCOUNT_SID,
AUTH_TOKEN
```

