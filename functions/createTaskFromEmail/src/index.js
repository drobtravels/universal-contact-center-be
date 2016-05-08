import twilio from 'twilio';
let twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
let twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
let taskRouterWorkspaceSid = process.env.TASK_ROUTER_WORKSPACE_SID;

export default function(event, context) {
  var params = {
    type: 'email',
    fromEmail: event.FromEmail,
    name: event.FromName,
    message: event.Message,
    subject: event.Subject,
    messageID: event.MessageID,
    date: event.Date
  }

  console.log('create task with params', params)
  var client = new twilio.TaskRouterClient(twilioAccountSid, twilioAuthToken, taskRouterWorkspaceSid);
  client.workspace.tasks.create({ attributes: JSON.stringify(params) }).then( (task) => {
    context.succeed({});
  }, (error) => { context.fail(error) });
}
