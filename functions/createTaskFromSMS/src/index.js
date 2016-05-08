import qs from 'qs';
import twilio from 'twilio';
let twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
let twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
let taskRouterWorkspaceSid = process.env.TASK_ROUTER_WORKSPACE_SID;


export default function(event, context) {
  var params = qs.parse(event.encodedParams)
  params.type = 'sms_message'
  params.fromPhone = params.From
  params.message = params.Body
  var client = new twilio.TaskRouterClient(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  client.workspace.tasks.create({ attributes: JSON.stringify(params) }).then( (task) => {
    context.succeed({});
  }, (error) => { context.fail(error) });
}
