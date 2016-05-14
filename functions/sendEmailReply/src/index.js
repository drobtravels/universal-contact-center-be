import fetch from 'node-fetch';
import validateUser from 'helpers/validateUser';

export default function(event, context) {

  if( validateUser(event.userToken, event.credentials.auth0Secret) ) {
    var params = {
      "From": event.from,
      "To": event.email,
      "Subject": event.subject,
      "TextBody": event.message
    }

    fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': event.credentials.postmarkToken
      },
      body: JSON.stringify(params)
    })
    	.then( (response) => response.json() )
    	.then( (json) => {
        context.succeed(json)
      }, (error) => context.fail({ apiError: error }) )
  } else {
    context.fail('unauthorized user');
  }
}
