const jwt = require('jsonwebtoken');
const config = require('../config');
const AuthorizationError = require('../errors/AuthorizationError');

// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Аторизируйтесь'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw new AuthorizationError('Аторизируйтесь');
  }
  req.user = payload;
  next();
};
