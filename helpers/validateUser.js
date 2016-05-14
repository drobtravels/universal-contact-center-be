import jwt from 'jsonwebtoken';

export default function validateUser(authToken, auth0Secret) {
  try {
    var secretBuf = new Buffer(auth0Secret, 'base64');
    var decoded = jwt.verify(authToken, secretBuf)
    console.log('succesfully authenticated')
    console.log(decoded);
    return(decoded);
  } catch(err) {
    console.log('failed jwt verify: ', err, 'auth: ', authToken);``
    return(false);
  }
}
