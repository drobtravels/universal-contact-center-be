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
  return(capability.generate());
}

function emailToClientName(email) {
  return(email.replace(/[^a-z0-9_]/gi, "_"));
}

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
