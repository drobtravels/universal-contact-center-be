import fetch from 'node-fetch';
import validateUser from 'helpers/validateUser';

/**
 * sends an outgoing e-mail
 * @param {Object} event - data provided by API Gateway
 * @param {string} event.from - e-mail to send from
 * @param {string} event.email - e-mail to send to
 * @param {string} event.subject - subject of e-mail
 * @param {string} event.message - text body of e-mail
 * @param {string} event.userToken - auth0 user JSON web token
 * @param {Object} event.credentials - Relevent Credentials as set in API Gateway stage varaibles
 * @param {string} event.credentials.auth0Secret - Auth0 secret to authenticate users
 * @param {string} event.credentials.postmarkToken - Postmark Server token to authenticate
 */
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
