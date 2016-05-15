import twilio from 'twilio';
import validateUser from 'helpers/validateUser';

/**
 * sends an outgoing SMS message
 * @param {Object} event - data provided by API Gateway
 * @param {string} event.message - text body of SMS
 * @param {string} event.to - phone # to send SMS to
 * @param {string} event.from -  phone # to send SMS from
 * @param {string} event.userToken - auth0 user JSON web token
 * @param {Object} event.credentials - Relevent Credentials as set in API Gateway stage varaibles
 * @param {string} event.credentials.auth0Secret - Auth0 secret to authenticate users
 * @param {string} event.credentials.accountSid - Twilio Account Sid
 * @param {string} event.credentials.authToken - Twilio Auth Token
 */
export default function(event, context) {
  if( validateUser(event.userToken, event.credentials.auth0Secret) ) {
    var client = new twilio.RestClient(event.credentials.accountSid, event.credentials.authToken)
    client.messages.create({
      body: event.message,
      to: event.phone,
      from: event.from
    }).then( (message) => {
      context.succeed(message);
    }, (error) => { context.fail(error) });
  } else {
    context.fail('unauthorized user');
  }
}
