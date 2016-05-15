import twilio from 'twilio';
import validateUser from 'helpers/validateUser';

function findOrCreateTaskRouterWorker(userEmail, credentials) {
  var client = new twilio.TaskRouterClient(credentials.accountSid, credentials.authToken, credentials.workspaceSid);
  var workerParams = { "FriendlyName": userEmail };
  return client.workspace.workers.get(workerParams).then(function(data) {
    var worker = data.workers[0];
    var params = { credentials: credentials }
    if(worker) {
      params.worker = worker;
    } else {
      workerParams.attributes = JSON.stringify({"contact_uri": "client:" + emailToClientName(userEmail) });
      return client.workspace.workers.create(workerParams).then(function(worker) {
        params.worker = worker;
      });
    }
    return(params);
  }, function(err){
    console.error(err);
  });
}

function getTaskRouterToken(params) {
  console.log('task router params are', params);
  var capability = new twilio.TaskRouterWorkerCapability(params.credentials.accountSid, params.credentials.authToken, params.credentials.workspaceSid, params.worker.sid);
  capability.allowActivityUpdates();
  capability.allowReservationUpdates();
  return { token: capability.generate(), credentials: params.credentials };
}

function getTwilioClientToken(email, credentials) {
  var capability = new twilio.Capability(credentials.accountSid, credentials.authToken)
  capability.allowClientIncoming(emailToClientName(email))
  capability.allowClientOutgoing(credentials.outgoingApplicationSid)
  return(capability.generate())
}

function emailToClientName(email) {
  return(email.replace(/[^a-z0-9_]/gi, "_"));
}

/**
 * generate JSON Web Tokens for Twilio Client and Task Router
 * @param {Object} event - data provided by API Gateway
 * @param {string} event.userToken - auth0 user JSON web token
 * @param {Object} event.credentials - Relevent Credentials as set in API Gateway stage varaibles
 * @param {string} event.credentials.auth0Secret - Auth0 secret to authenticate users
 * @param {string} event.credentials.accountSid - Twilio Account Sid
 * @param {string} event.credentials.authToken - Twilio Auth Token
 * @param {string} event.credentials.workspaceSid - SID of Twilio Task Router Workspace
 * @param {string} event.credentials.outgoingApplicationSid - SID of Twilio Application for outgoing calls
 */
export default function(event, context) {
  var userDetails = validateUser(event.userToken, event.credentials.auth0Secret);
  if( userDetails ) {
    findOrCreateTaskRouterWorker(userDetails.email, event.credentials)
    .then(getTaskRouterToken)
    .then(function(params) {
      context.succeed({
        status: 'success',
        tokens: {
          taskRouter: params.token,
          twilioClient: getTwilioClientToken(userDetails.email, event.credentials)
        }
      });
    })
    .fail(function(err) {
      context.fail(err);
    });
  } else {
    context.fail('invalid user');
  }
}
