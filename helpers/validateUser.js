import jwt from 'jsonwebtoken';

/**
 * sends an outgoing SMS message
 * @param {string} authToken - Auth0 user JSON web token to validate
 * @param {string} auth0Secret - Auth0 secret to authenticate users
 * @return {Object|boolean} user params if authenticated user or false
 */
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
