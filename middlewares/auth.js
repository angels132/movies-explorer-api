const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_SIGNING_KEY } = require('../utils/config');

const UNAUTHORIZED_ERROR = require('../utils/errors/UnauthorizedError'); // 401
const RESPONSE_MESSAGES = require('../utils/constants');

const { unathorized } = RESPONSE_MESSAGES[401].users;

function authorizeUser(req, _, next) {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UNAUTHORIZED_ERROR(unathorized));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'dev-secret');
  } catch (err) {
    return next(new UNAUTHORIZED_ERROR(unathorized));
  }

  req.user = payload;

  return next();
}

module.exports = authorizeUser;
