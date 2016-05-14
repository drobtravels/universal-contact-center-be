import twilio from 'twilio';
import validateUser from 'helpers/validateUser';

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
