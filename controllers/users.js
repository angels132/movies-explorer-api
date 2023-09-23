const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_SIGNING_KEY, PASSWORD_REGEX } = require('../utils/constants');

const INACCURATE_DATA_ERROR = require('../utils/errors/InaccurateDataError'); // 400
const UNAUTHORIZED_ERROR = require('../utils/errors/UnauthorizedError'); // 401
const NOT_FOUND_ERROR = require('../utils/errors/NotFoundError'); // 404
const CONFLICT_ERROR = require('../utils/errors/ConflictError'); // 409

const User = require('../models/user');

function registerUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!PASSWORD_REGEX.test(password)) {
    throw new INACCURATE_DATA_ERROR('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол');
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(201).send({ message: 'Пользователь успешно зарегистрирован на сайте' }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new CONFLICT_ERROR('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new INACCURATE_DATA_ERROR('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  if (!PASSWORD_REGEX.test(password)) {
    throw new INACCURATE_DATA_ERROR('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол');
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

      throw new UNAUTHORIZED_ERROR('Неправильные почта или пароль');
    })
    .catch(next);
}

function getCurrentUserInfo(req, res, next) {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (user) return res.send(user);

      throw new NOT_FOUND_ERROR('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new INACCURATE_DATA_ERROR('Передан некорректный id пользователя'));
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

      throw new NOT_FOUND_ERROR('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new INACCURATE_DATA_ERROR('Передан некорректный id пользователя'));
      }

      if (err.name === 'ValidationError') {
        return next(new INACCURATE_DATA_ERROR('Переданы некорректные данные при обновлении данных профиля пользователя'));
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
