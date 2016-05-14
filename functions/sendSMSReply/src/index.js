import twilio from 'twilio';
import jwt from 'jsonwebtoken';

function validateUser(authToken, auth0Secret) {
  try {
    var secretBuf = new Buffer(auth0Secret, 'base64');
    var decoded = jwt.verify(authToken, secretBuf)
    console.log('succesfully authenticated')
    return(true);
  } catch(err) {
    console.log('failed jwt verify: ', err, 'auth: ', authToken);``
    return(false);
  }
}

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
