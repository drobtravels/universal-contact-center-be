import qs from 'qs';
import twilio from 'twilio';


export default function(event, context) {
  var params = qs.parse(event.encodedParams)
  params.type = 'sms_message'
  params.fromPhone = params.From
  params.message = params.Body
  var client = new twilio.TaskRouterClient(event.credentials.accountSid, event.credentials.authToken, event.credentials.workspaceSid);
  client.workspace.tasks.create({ attributes: JSON.stringify(params) }).then( (task) => {
    context.succeed({});
  }, (error) => { context.fail(error) });
}
