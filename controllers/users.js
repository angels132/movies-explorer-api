const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_SIGNING_KEY } = require('../utils/config');
const { PASSWORD_REGEX } = require('../utils/validation');
const RESPONSE_MESSAGES = require('../utils/constants');

const INACCURATE_DATA_ERROR = require('../utils/errors/InaccurateDataError'); // 400
const UNAUTHORIZED_ERROR = require('../utils/errors/UnauthorizedError'); // 401
const NOT_FOUND_ERROR = require('../utils/errors/NotFoundError'); // 404
const CONFLICT_ERROR = require('../utils/errors/ConflictError'); // 409

const { registrationSuccess } = RESPONSE_MESSAGES[201].users;

const {
  cast,
  passwordRequirements,
  validationRegistration,
  validationUpdate,
} = RESPONSE_MESSAGES[400].users;

const { unathorized } = RESPONSE_MESSAGES[401].users;
const { idNotFound } = RESPONSE_MESSAGES[404].users;
const { emailDuplication } = RESPONSE_MESSAGES[409].users;

const User = require('../models/user');

function registerUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!PASSWORD_REGEX.test(password)) {
    throw new INACCURATE_DATA_ERROR(passwordRequirements);
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(201).send({ message: registrationSuccess }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new CONFLICT_ERROR(emailDuplication));
      } else if (err.name === 'ValidationError') {
        next(new INACCURATE_DATA_ERROR(validationRegistration));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  if (!PASSWORD_REGEX.test(password)) {
    throw new INACCURATE_DATA_ERROR(passwordRequirements);
  }

  User
    .findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          NODE_ENV === 'production' ? SECRET_SIGNING_KEY : 'dev-secret',
          { expiresIn: '7d' },
        );

        return res.send({ token });
      }

      throw new UNAUTHORIZED_ERROR(unathorized);
    })
    .catch(next);
}

function getCurrentUserInfo(req, res, next) {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (user) return res.send(user);

      throw new NOT_FOUND_ERROR(idNotFound);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new INACCURATE_DATA_ERROR(cast));
      } else {
        next(err);
      }
    });
}

function setCurrentUserInfo(req, res, next) {
  const { email, name } = req.body;
  const { _id } = req.user;

  User
    .findByIdAndUpdate(
      _id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send(user);

      throw new NOT_FOUND_ERROR(idNotFound);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new CONFLICT_ERROR(emailDuplication));
      }

      if (err.name === 'CastError') {
        return next(new INACCURATE_DATA_ERROR(cast));
      }

      if (err.name === 'ValidationError') {
        return next(new INACCURATE_DATA_ERROR(validationUpdate));
      }

      return next(err);
    });
}

module.exports = {
  registerUser,
  loginUser,

  getCurrentUserInfo,
  setCurrentUserInfo,
};
