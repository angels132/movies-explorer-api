const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_SIGNING_KEY } = require('../utils/constants');

const UNAUTHORIZED_ERROR = require('../utils/errors/UnauthorizedError');

function authorizeUser(req, _, next) {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UNAUTHORIZED_ERROR('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'dev-secret');
  } catch (err) {
    return next(new UNAUTHORIZED_ERROR('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
}

module.exports = authorizeUser;
