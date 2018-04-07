# GPU Poller

This app will periodically poll for gpu's in stock and send a text to your phone if you configure it for yourself.  You'll need to generate a keys.js file in the config folder to run it locally or set some server env variables to deploy it.

The variables to add to the keys.js are:
```
TWILIO_PHONE_NUMBER,
MY_PHONE_NUMBER,
ACCOUNT_SID,
AUTH_TOKEN
```

Also, running `npm start` will kick up a basic express server on port 3000.  Check out the routes in index.js to do things like start the poller, stop the poller, check the poller's status, and to reset the list of Product IDs a text message has been sent for.

The goal down the road will be to make this more flexible and to be more of a generic poller to handle any endpoint via callback methods provided to the class.  That's a problem for future Rob though.
