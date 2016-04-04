import twilio from 'twilio';
import jwt from 'jsonwebtoken';
let twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
let twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
let taskRouterWorkspaceSid = process.env.TASK_ROUTER_WORKSPACE_SID;

function validateUser(authToken) {
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

function findOrCreateTaskRouterWorker(userEmail) {
  console.log(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  var client = new twilio.TaskRouterClient(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  var workerParams = { "FriendlyName": userEmail };
  return client.workspace.workers.get(workerParams).then(function(data) {
    var worker = data.workers[0];
    if(worker) {
      return(worker.sid);
    } else {
      workerParams.attributes = JSON.stringify({"contact_uri": emailToClientName(userEmail) });
      return client.workspace.workers.create(workerParams).then(function(worker) {
        return(worker.sid);
      });
    }
  }, function(err){
    console.error(err);
  });
}

function getTaskRouterToken(workerSid) {
  var capability = new twilio.TaskRouterWorkerCapability(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid, workerSid);
  capability.allowActivityUpdates();
  capability.allowReservationUpdates();
  return capability.generate();
}

function getTwilioClientToken(email) {
  var capability = new twilio.Capability(twilioAccountSid, twilioAuthToken)
  capability.allowClientIncoming(emailToClientName(email))
  return(capability.generate());
}

function emailToClientName(email) {
  return(email.replace(/[^a-z0-9_]/gi, "_"));
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
          twilioClient: getTwilioClientToken(userDetails.email)
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
