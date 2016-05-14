import postmark from 'postmark';
import validateUser from 'helpers/validateUser';

export default function(event, context) {
  console.log('event', event)
  if( validateUser(event.userToken, event.credentials.auth0Secret) ) {
    console.log('creating client')
    var client = new postmark.Client(event.credentials.postmarkToken)
    console.log('client created')
    client.sendEmail({
      "From": event.from,
      "To": event.email,
      "Subject": event.subject,
      "TextBody": event.message
    }, (error, result) => {
      if(error) {
        console.error('error sending e-mail', error)
        context.fail({ error: error })
      } else {
        context.succeed(result)
      }
    })
  } else {
    context.fail('unauthorized user');
  }
}
