## Universal Contact Center
### Backend / Lambda functions

Backend code for a fully functional, serverless, contact center which can handle phone calls, SMS messages, or e-mails. "Hosted" on [AWS Lambda](https://aws.amazon.com/lambda/), Managed using [Apex](http://apex.run/).  Also requires appropriate [API Gateway Configuration](https://github.com/droberts84/universal-contact-center-be/blob/master/config/api_gateway_swagger.json)

Demoed at [SIGNAL 2016](https://www.twilio.com/signal/schedule/6hw4T5PinKeYaEOUoWoAKS/building-a-universal-call-center-with-task-router-and-aws-lambda).  Slides are [here](https://speakerdeck.com/droberts84/how-to-build-a-universal-contact-center-for-fun-and-profit)

Frontend code lives in [its own repository](https://github.com/droberts84/universal-contact-center-fe)

To deploy code:

- Install and configure [Apex](http://apex.run/)
- run `apex deploy`

Integrates with a number of services:

- [Twilio Task Router](https://www.twilio.com/taskrouter) to match incoming requests to agents / clients
- [Twilio Client](https://www.twilio.com/client) to make / receive phone calls through the browser
- [Twilio Programmable Voice](https://www.twilio.com/voice)
- [Twilio Programmable SMS](https://www.twilio.com/sms)
- [Auth0](https://auth0.com/) for authenticating clients
- [Postmark](https://postmarkapp.com/) for sending / receiving e-mails
