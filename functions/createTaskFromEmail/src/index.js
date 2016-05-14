import twilio from 'twilio';

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
  var client = new twilio.TaskRouterClient(event.credentials.accountSid, event.credentials.authToken, event.credentials.workspaceSid);
  client.workspace.tasks.create({ attributes: JSON.stringify(params) }).then( (task) => {
    context.succeed({});
  }, (error) => { context.fail(error) });
}
