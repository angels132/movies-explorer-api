const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const NOT_FOUND_ERROR = require('../utils/errors/NotFoundError');
const RESPONSE_MESSAGES = require('../utils/constants');

const { emailRegistration } = RESPONSE_MESSAGES[404].users;

const { EMAIL_REGEX } = require('../utils/validation');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => EMAIL_REGEX.test(email),
        message: 'Требуется ввести электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
    },
  },

  {
    statics: {
      findUserByCredentials(email, password) {
        return (
          this
            .findOne({ email })
            .select('+password')
        )
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password)
                .then((matched) => {
                  if (matched) return user;

                  return Promise.reject();
                });
            }

            throw new NOT_FOUND_ERROR(emailRegistration);
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
