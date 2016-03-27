import twilio from 'twilio';
import jwt from 'jsonwebtoken';


let validateUser = function(authToken) {
  try {
    var secretBuf = new Buffer(process.env.AUTH_SECRET, 'base64');
    var decoded = jwt.verify(authToken, secretBuf)
    console.log('succesfully authenticated')
    console.log(decoded);
    return(decoded);
  } catch(err) {
    console.log('failed jwt verify: ', err, 'auth: ', authToken);
    return(false);
  }
}

let getTaskRouterToken = function() {
  return('');
}

let getTwilioClientToken = function() {
  return('something');
}

export default function(event, context) {
  var userDetails = validateUser(event.userToken);
  if( userDetails ) {
    context.succeed({
      status: 'success',
      tokens: {
        taskRouter: getTaskRouterToken(),
        twilioClient: getTwilioClientToken()
      }
    });
  } else {
    context.fail('invalid user');
  }
}
