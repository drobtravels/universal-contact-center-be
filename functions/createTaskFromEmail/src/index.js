import twilio from 'twilio';
let twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
let twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
let taskRouterWorkspaceSid = process.env.TASK_ROUTER_WORKSPACE_SID;


export default function(event, context) {
  console.log(event);
  var email_info = event.message;
  var params = {
    type: 'email',
    From: email_info.from,
    Body: email_info.text,
    Subject: email_info.subject,
    To: email_info.to
  };
  var client = new twilio.TaskRouterClient(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  client.workspace.tasks.create({ attributes: JSON.stringify(params) }).then( (task) => {
    context.succeed({});
  }, (error) => { context.fail(error) });
}
