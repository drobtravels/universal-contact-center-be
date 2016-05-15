import qs from 'qs';


export default function(event, context) {
  var params = qs.parse(event.encodedParams)
  context.succeed(params)
}
