import twilio from 'twilio';
import jwt from 'jsonwebtoken';


let validateUser = function(authToken) {
  var secretBuf = new Buffer(process.env.AUTH_SECRET, 'base64');
  jwt.verify(authToken, secretBuf, function(err, decoded) {
    if(err) {
      console.log('failed jwt verify: ', err, 'auth: ', authToken);
      return(false);
    } else {
      console.log('succesfully authenticated')
      return(decoded);
    }
  })
}

export default function(event, context) {
  var userDetails = validateUser(event.userToken);
  if (userDetails) {
    context.succeed('ok');
  } else {
    context.fail('invalid user');
  }
}
