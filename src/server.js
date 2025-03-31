const jwt = require('jsonwebtoken');
const { claims } = require('./claims');
const privateKey = require('./privateKey');
const publicKey = require('./publicKey');

/**
 * Generación del JWT por parte del servidor SUTyP
 * 
 * @returns string
 */
function issueToken() {

  const { iss, aud, sub } = claims;

  /*
  NumericDate
    A JSON numeric value representing the number of seconds from
    1970-01-01T00:00:00Z UTC until the specified UTC date/time,
    ignoring leap seconds.  This is equivalent to the IEEE Std 1003.1,
    2013 Edition [POSIX.1] definition "Seconds Since the Epoch", in
    which each day is accounted for by exactly 86400 seconds, other
    than that non-integer values can be represented.  See RFC 3339
    [RFC3339] for details regarding date/times in general and UTC in
    particular.
  */
  const exp = Math.floor(Date.now() / 1000) + 3600; // Current time in seconds + 1 hour (3600 seconds)

  const token = jwt.sign({
    iss,
    aud,
    sub,
    exp: exp,
  }, privateKey, { algorithm: 'RS256' });

  return token;
}

/**
 * Verificación del JWT por parte del API de la concesionaria
 * 
 * @returns boolean
 */
function verifyToken(token) {

  const { iss, aud, sub } = claims;

  try {
    const decoded = jwt.verify(token, publicKey, { audience: aud, issuer: iss, subject: sub  });
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
}

module.exports = { issueToken, verifyToken };