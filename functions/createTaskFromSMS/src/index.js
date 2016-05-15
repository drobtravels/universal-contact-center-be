import qs from 'qs';
import twilio from 'twilio';

/**
 * recieve SMS from Twilio and create task in Task Router
 * @param {Object} event - data provided by API Gateway
 * @param {Object} event.credentials - Relevent Credentials as set in API Gateway stage varaibles
 * @param {string} event.credentials.accountSid - Twilio Account Sid
 * @param {string} event.credentials.authToken - Twilio Auth Token
 * @param {string} event.credentials.workspaceSid - SID of Twilio Task Router Workspace
 * @param {string} event.encodedParams - URL encoded params from Twilio request https://www.twilio.com/docs/api/twiml/sms/twilio_request
 */
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
