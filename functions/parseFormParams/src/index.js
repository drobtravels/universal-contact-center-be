import qs from 'qs';

/**
 * decode URL encoded params into JSON for use by API Gateway
 * @param {Object} event - data provided by API Gateway
 * @param {string} event.encodedParams - URL encoded params from Twilio request https://www.twilio.com/docs/api/twiml/sms/twilio_request
 */
export default function(event, context) {
  var params = qs.parse(event.encodedParams)
  context.succeed(params)
}
