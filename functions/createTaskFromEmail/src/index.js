import twilio from 'twilio';
/**
 * recieve e-mail from Postmark and create task in Task Router
 * @param {Object} event - data provided by API Gateway
 * @param {Object} event.credentials - Relevent Credentials as set in API Gateway stage varaibles
 * @param {string} event.credentials.accountSid - Twilio Account Sid
 * @param {string} event.credentials.authToken - Twilio Auth Token
 * @param {string} event.credentials.workspaceSid - SID of Twilio Task Router Workspace
 * @param {string} event.FromEmail - e-mail of sender
 * @param {string} event.FromName - name of sender
 * @param {string} event.Message - text body of e-mail
 * @param {string} event.Subject - e-mail subject
 * @param {string} event.MessageID - Postmark unique id
 * @param {string} event.Date - Date e-mail was sent
 */
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
