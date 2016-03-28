import twilio from 'twilio';
import jwt from 'jsonwebtoken';
let twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
let twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
let taskRouterWorkspaceSid = process.env.TASK_ROUTER_WORKSPACE_SID;

let validateUser = function(authToken) {
  try {
    var secretBuf = new Buffer(process.env.AUTH_SECRET, 'base64');
    var decoded = jwt.verify(authToken, secretBuf)
    console.log('succesfully authenticated')
    console.log(decoded);
    return(decoded);
  } catch(err) {
    console.log('failed jwt verify: ', err, 'auth: ', authToken);``
    return(false);
  }
}

let findOrCreateTaskRouterWorker = function(userEmail) {
  console.log(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  var client = new twilio.TaskRouterClient(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  return client.workspace.workers.get({ "FriendlyName": userEmail }).then(function(data) {
    return(data.workers[0].sid);
  }, function(err){
    console.error(err);
  });
}

let getTaskRouterToken = function(workerSid) {
  var capability = new twilio.TaskRouterWorkerCapability(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid, workerSid);
  capability.allowActivityUpdates();
  capability.allowReservationUpdates();
  return capability.generate();
}

let getTwilioClientToken = function() {
  var capability = new twilio.Capability(twilioAccountSid, twilioAuthToken)
  capability.allowClientOutgoing(process.env.TWIML_APP_SID);
  return(capability.generate());
}

export default function(event, context) {
  var userDetails = validateUser(event.userToken);
  if( userDetails ) {
    findOrCreateTaskRouterWorker(userDetails.email)
    .then(getTaskRouterToken)
    .then(function(taskRouterToken) {
      context.succeed({
        status: 'success',
        tokens: {
          taskRouter: taskRouterToken,
          twilioClient: getTwilioClientToken()
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
